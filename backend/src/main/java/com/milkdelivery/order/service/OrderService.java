package com.milkdelivery.order.service;

import com.milkdelivery.address.entity.Address;
import com.milkdelivery.address.repository.AddressRepository;
import com.milkdelivery.cart.entity.CartItem;
import com.milkdelivery.cart.repository.CartItemRepository;
import com.milkdelivery.order.dto.PlaceOrderRequest;
import com.milkdelivery.order.entity.Order;
import com.milkdelivery.order.entity.OrderItem;
import com.milkdelivery.order.entity.OrderStatus;
import com.milkdelivery.order.repository.OrderRepository;
import com.milkdelivery.user.entity.User;
import com.milkdelivery.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import com.milkdelivery.order.dto.OrderResponse;
import com.milkdelivery.order.mapper.OrderMapper;
import com.milkdelivery.inventory.service.InventoryService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.milkdelivery.order.dto.OrderTimelineResponse;

@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final OrderMapper orderMapper;
    private final InventoryService inventoryService;

    public OrderService(
            OrderRepository orderRepository,
            CartItemRepository cartItemRepository,
            UserRepository userRepository,
            AddressRepository addressRepository,
            OrderMapper orderMapper,
            InventoryService inventoryService
    ) {
        this.orderRepository = orderRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.orderMapper = orderMapper;
        this.inventoryService = inventoryService;
    }

    private User getCurrentUser(Authentication authentication) {

        String username = authentication.getName();

        return userRepository.findByEmail(username)
                .or(() -> userRepository.findByPhoneNumber(username))
                .orElseThrow();
    }

    public Order placeOrder(
            PlaceOrderRequest request,
            Authentication authentication
    ) {

        User user = getCurrentUser(authentication);

        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow();

        if (!address.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Invalid address.");
        }

        List<CartItem> cartItems = cartItemRepository.findByUser(user);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty.");
        }

        Order order = new Order();
        order.setUser(user);
        order.setAddress(address);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PLACED);

        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0;

        for (CartItem cartItem : cartItems) {

            if (cartItem.getQuantity() > cartItem.getProduct().getMaxOrderQuantity()) {

                throw new RuntimeException(
                        cartItem.getProduct().getName()
                                + " can only be ordered up to "
                                + cartItem.getProduct().getMaxOrderQuantity()
                                + " "
                                + cartItem.getProduct().getUnit()
                                + " per order."
                );
            }

            inventoryService.reserveStock(
                    cartItem.getProduct(),
                    cartItem.getQuantity()
            );

            double unitPrice;

            if (cartItem.getProductSize() != null) {
                unitPrice = cartItem.getProductSize().getPrice();
            } else {
                unitPrice = cartItem.getProduct().getPrice();
            }

            OrderItem item = new OrderItem();

            item.setOrder(order);
            item.setProduct(cartItem.getProduct());
            item.setProductSize(cartItem.getProductSize());
            item.setPrice(unitPrice);
            item.setQuantity(cartItem.getQuantity());

            orderItems.add(item);

            totalAmount += unitPrice * cartItem.getQuantity();
        }

        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);

        cartItemRepository.deleteAll(cartItems);

        return savedOrder;
    }

    public List<OrderResponse> getOrders(Authentication authentication) {

        User user = getCurrentUser(authentication);

        return orderRepository.findByUserOrderByOrderDateDesc(user)
                .stream()
                .map(orderMapper::toOrderResponse)
                .toList();
    }

    @Transactional
    public OrderResponse cancelOrder(
            Long orderId,
            Authentication authentication
    ) {

        User user = getCurrentUser(authentication);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found."));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not allowed to cancel this order.");
        }

        if (order.getStatus() != OrderStatus.PLACED) {
            throw new RuntimeException("Only placed orders can be cancelled.");
        }

        for (OrderItem item : order.getItems()) {
            inventoryService.releaseReservedStock(
                    item.getProduct(),
                    item.getQuantity()
            );
        }

        order.setStatus(OrderStatus.CANCELLED);

        Order savedOrder = orderRepository.save(order);

        return orderMapper.toOrderResponse(savedOrder);
    }

    public OrderTimelineResponse getOrderTimeline(
            Long orderId,
            Authentication authentication
    ) {

        User user = getCurrentUser(authentication);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException("Order not found.")
                );

        if (!order.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException(
                    "You are not allowed to view this order."
            );
        }

        OrderTimelineResponse response =
                new OrderTimelineResponse();

        response.setOrderId(order.getId());
        response.setStatus(order.getStatus());

        response.setPlacedAt(order.getOrderDate());
        response.setPackedAt(order.getPackedAt());
        response.setPickedAt(order.getPickedAt());
        response.setDeliveredAt(order.getDeliveredAt());

        return response;
    }
}