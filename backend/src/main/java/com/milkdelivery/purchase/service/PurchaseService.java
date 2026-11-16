package com.milkdelivery.purchase.service;

import com.milkdelivery.address.entity.Address;
import com.milkdelivery.address.repository.AddressRepository;
import com.milkdelivery.cart.entity.CartItem;
import com.milkdelivery.cart.repository.CartItemRepository;
import com.milkdelivery.inventory.service.InventoryService;
import com.milkdelivery.order.entity.Order;
import com.milkdelivery.order.entity.OrderItem;
import com.milkdelivery.order.entity.OrderStatus;
import com.milkdelivery.payment.entity.Payment;
import com.milkdelivery.payment.entity.PaymentStatus;
import com.milkdelivery.payment.repository.PaymentRepository;
import com.milkdelivery.product.entity.ProductCategory;
import com.milkdelivery.purchase.dto.PlacePurchaseRequest;
import com.milkdelivery.purchase.dto.PurchaseOrderSummary;
import com.milkdelivery.purchase.dto.PurchaseResponse;
import com.milkdelivery.purchase.entity.Purchase;
import com.milkdelivery.purchase.repository.PurchaseRepository;
import com.milkdelivery.user.entity.User;
import com.milkdelivery.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class PurchaseService {
    private final PurchaseRepository purchaseRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final PaymentRepository paymentRepository;
    private final InventoryService inventoryService;

    public PurchaseService(PurchaseRepository purchaseRepository,
                           CartItemRepository cartItemRepository,
                           UserRepository userRepository,
                           AddressRepository addressRepository,
                           PaymentRepository paymentRepository,
                           InventoryService inventoryService) {
        this.purchaseRepository = purchaseRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.paymentRepository = paymentRepository;
        this.inventoryService = inventoryService;
    }

    private User currentUser(Authentication authentication) {
        String username = authentication.getName();
        return userRepository.findByEmail(username)
                .or(() -> userRepository.findByPhoneNumber(username))
                .orElseThrow();
    }

    public PurchaseResponse placePurchase(PlacePurchaseRequest request, Authentication authentication) {
        User user = currentUser(authentication);

        if (request.getPaymentReference() != null && !request.getPaymentReference().isBlank()) {
            var existing = purchaseRepository.findByPaymentReference(request.getPaymentReference());
            if (existing.isPresent()) {
                Purchase purchase = existing.get();
                if (!purchase.getUser().getId().equals(user.getId())) {
                    throw new IllegalArgumentException("Payment reference does not belong to this customer.");
                }
                return toResponse(purchase);
            }
        }

        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new IllegalArgumentException("Delivery address was not found."));
        if (!address.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("The selected delivery address does not belong to this customer.");
        }

        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("Cart is empty.");
        }

        Map<ProductCategory, List<CartItem>> grouped = new EnumMap<>(ProductCategory.class);
        double grandTotal = 0.0;

        for (CartItem cartItem : cartItems) {
            if (cartItem.getQuantity() > cartItem.getProduct().getMaxOrderQuantity()) {
                throw new IllegalArgumentException(
                        cartItem.getProduct().getName() + " exceeds the maximum order quantity of "
                                + cartItem.getProduct().getMaxOrderQuantity() + " "
                                + cartItem.getProduct().getUnit() + "."
                );
            }
            ProductCategory category = cartItem.getProduct().getCategory() == null
                    ? ProductCategory.DAIRY : cartItem.getProduct().getCategory();
            grouped.computeIfAbsent(category, key -> new ArrayList<>()).add(cartItem);

            double unitPrice = cartItem.getProductSize() != null
                    ? cartItem.getProductSize().getPrice()
                    : cartItem.getProduct().getPrice();
            grandTotal += unitPrice * cartItem.getQuantity();
        }

        Payment payment = null;
        String paymentReference = request.getPaymentReference();
        if (paymentReference != null && !paymentReference.isBlank()) {
            payment = paymentRepository.findByRazorpayOrderIdAndUser(paymentReference, user)
                    .orElseThrow(() -> new IllegalArgumentException("Verified payment could not be found."));
            if (payment.getStatus() != PaymentStatus.SUCCESS
                    || payment.getAmount() == null
                    || Math.abs(payment.getAmount() - grandTotal) > 0.01) {
                throw new IllegalArgumentException("Payment amount does not match the current cart total.");
            }
        }

        Purchase purchase = new Purchase();
        purchase.setUser(user);
        purchase.setAddress(address);
        purchase.setGrandTotal(grandTotal);
        purchase.setCreatedAt(LocalDateTime.now());
        purchase.setPaymentReference(paymentReference);
        purchase.setStatus(payment == null ? "CONFIRMED" : "PAID");

        List<Order> departmentOrders = new ArrayList<>();
        for (Map.Entry<ProductCategory, List<CartItem>> entry : grouped.entrySet()) {
            Order order = new Order();
            order.setUser(user);
            order.setAddress(address);
            order.setPurchase(purchase);
            order.setCategory(entry.getKey());
            order.setOrderDate(LocalDateTime.now());
            order.setStatus(OrderStatus.PLACED);

            List<OrderItem> orderItems = new ArrayList<>();
            double departmentTotal = 0.0;
            for (CartItem cartItem : entry.getValue()) {
                inventoryService.reserveStock(cartItem.getProduct(), cartItem.getQuantity());

                double unitPrice = cartItem.getProductSize() != null
                        ? cartItem.getProductSize().getPrice()
                        : cartItem.getProduct().getPrice();

                OrderItem item = new OrderItem();
                item.setOrder(order);
                item.setProduct(cartItem.getProduct());
                item.setProductSize(cartItem.getProductSize());
                item.setPrice(unitPrice);
                item.setQuantity(cartItem.getQuantity());
                orderItems.add(item);
                departmentTotal += unitPrice * cartItem.getQuantity();
            }
            order.setItems(orderItems);
            order.setTotalAmount(departmentTotal);
            departmentOrders.add(order);
        }

        purchase.setOrders(departmentOrders);
        Purchase saved = purchaseRepository.save(purchase);
        cartItemRepository.deleteAll(cartItems);
        return toResponse(saved);
    }

    public List<PurchaseResponse> getPurchases(Authentication authentication) {
        User user = currentUser(authentication);
        return purchaseRepository.findByUser_IdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toResponse).toList();
    }

    private PurchaseResponse toResponse(Purchase purchase) {
        List<PurchaseOrderSummary> orders = purchase.getOrders().stream()
                .map(order -> new PurchaseOrderSummary(
                        order.getId(),
                        order.getCategory() == null ? ProductCategory.DAIRY.name() : order.getCategory().name(),
                        order.getTotalAmount(),
                        order.getStatus().name()
                )).toList();
        return new PurchaseResponse(
                purchase.getId(),
                purchase.getGrandTotal(),
                purchase.getCreatedAt(),
                purchase.getPaymentReference(),
                orders
        );
    }
}
