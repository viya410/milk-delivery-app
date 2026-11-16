package com.milkdelivery.admin.service;

import com.milkdelivery.address.repository.AddressRepository;
import com.milkdelivery.admin.dto.AdminDashboardResponse;
import com.milkdelivery.admin.dto.AdminUserResponse;
import com.milkdelivery.admin.dto.UpdateUserRequest;
import com.milkdelivery.inventory.service.InventoryService;
import com.milkdelivery.order.dto.OrderResponse;
import com.milkdelivery.order.entity.Order;
import com.milkdelivery.order.entity.OrderItem;
import com.milkdelivery.order.entity.OrderStatus;
import com.milkdelivery.order.mapper.OrderMapper;
import com.milkdelivery.order.repository.OrderRepository;
import com.milkdelivery.product.entity.Product;
import com.milkdelivery.product.repository.ProductRepository;
import com.milkdelivery.subscription.dto.SubscriptionResponse;
import com.milkdelivery.subscription.entity.SubscriptionStatus;
import com.milkdelivery.subscription.repository.SubscriptionRepository;
import com.milkdelivery.user.entity.User;
import com.milkdelivery.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final AddressRepository addressRepository;
    private final OrderMapper orderMapper;
    private final InventoryService inventoryService;
    private final SubscriptionRepository subscriptionRepository;

    public AdminService(
            UserRepository userRepository,
            OrderRepository orderRepository,
            ProductRepository productRepository,
            AddressRepository addressRepository,
            OrderMapper orderMapper,
            InventoryService inventoryService,
            SubscriptionRepository subscriptionRepository
    ) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.addressRepository = addressRepository;
        this.orderMapper = orderMapper;
        this.inventoryService = inventoryService;
        this.subscriptionRepository = subscriptionRepository;
    }

    public List<AdminUserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(user -> new AdminUserResponse(
                        user.getId(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getPhoneNumber(),
                        user.getRole(),
                        orderRepository.countByUser(user),
                        addressRepository.countByUser(user),
                        subscriptionRepository.countByUserAndStatus(
                                user,
                                SubscriptionStatus.ACTIVE
                        ),

                        subscriptionRepository.countByUserAndStatus(
                                user,
                                SubscriptionStatus.PAUSED
                        )
                ))
                .toList();

    }

    public User updateUser(Long id, UpdateUserRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(request.getRole());

        return userRepository.save(user);

    }

    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.delete(user);

    }

    public List<OrderResponse> getAllOrders() {

        return orderRepository.findAll()
                .stream()
                .map(orderMapper::toOrderResponse)
                .toList();

    }

    public OrderResponse getOrder(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        return orderMapper.toOrderResponse(order);

    }

    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderStatus previousStatus = order.getStatus();

        if (previousStatus == status) {
            return orderMapper.toOrderResponse(order);
        }

        // -------- VALIDATE STATUS FLOW --------

        switch (previousStatus) {

            case PLACED -> {
                if (status != OrderStatus.PACKED &&
                        status != OrderStatus.CANCELLED) {
                    throw new RuntimeException(
                            "A placed order can only be packed or cancelled."
                    );
                }
            }

            case PACKED -> {
                if (status != OrderStatus.CANCELLED) {
                    throw new RuntimeException(
                            "Packed orders can only be picked by a delivery partner or cancelled."
                    );
                }
            }

            case OUT_FOR_DELIVERY ->
                    throw new RuntimeException(
                            "Orders that are out for delivery can only be completed through OTP verification by the assigned delivery partner."
                    );

            case DELIVERED, CANCELLED ->
                    throw new RuntimeException(
                            "Completed orders cannot change status."
                    );
        }

        // -------- INVENTORY --------

        if (status == OrderStatus.CANCELLED &&
                previousStatus != OrderStatus.DELIVERED) {

            for (OrderItem item : order.getItems()) {

                inventoryService.releaseReservedStock(
                        item.getProduct(),
                        item.getQuantity()
                );
            }
        }

        // -------- TIMESTAMPS --------

        if (status == OrderStatus.PACKED) {
            order.setPackedAt(java.time.LocalDateTime.now());
        }

        order.setStatus(status);

        order = orderRepository.save(order);

        return orderMapper.toOrderResponse(order);
    }

    public AdminDashboardResponse getDashboard() {

        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();

        List<Order> orders = orderRepository.findAll();

        long totalOrders = orders.size();

        long pendingOrders = orders.stream()
                .filter(order ->
                        order.getStatus() == OrderStatus.PLACED
                                || order.getStatus() == OrderStatus.PACKED
                                || order.getStatus() == OrderStatus.OUT_FOR_DELIVERY
                )
                .count();

        long completedOrders = orders.stream()
                .filter(order -> order.getStatus() == OrderStatus.DELIVERED)
                .count();

        double totalRevenue = orders.stream()
                .filter(order -> order.getStatus() == OrderStatus.DELIVERED)
                .mapToDouble(Order::getTotalAmount)
                .sum();

        List<OrderResponse> recentOrders =
                orderRepository.findTop5ByOrderByOrderDateDesc()
                        .stream()
                        .map(orderMapper::toOrderResponse)
                        .toList();

        List<Product> unavailableProducts = productRepository.findByAvailableFalse();

        return new AdminDashboardResponse(
                totalUsers,
                totalProducts,
                totalOrders,
                pendingOrders,
                completedOrders,
                totalRevenue,
                recentOrders,
                unavailableProducts
        );

    }

    public List<OrderResponse> getTodayDeliveries() {

        LocalDate today = LocalDate.now();

        return orderRepository
                .findByOrderDateBetweenOrderByOrderDateAsc(
                        today.atStartOfDay(),
                        today.atTime(23, 59, 59)
                )
                .stream()
                .filter(order ->
                        order.getStatus() != OrderStatus.CANCELLED
                )
                .map(orderMapper::toOrderResponse)
                .toList();

    }

    public List<SubscriptionResponse> getUserSubscriptions(
            Long userId
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return subscriptionRepository
                .findByUser(user)
                .stream()
                .map(subscription -> new SubscriptionResponse(

                        subscription.getId(),

                        subscription.getProduct().getId(),

                        subscription.getProduct().getName(),

                        subscription.getQuantity(),

                        subscription.getProduct().getUnit(),

                        subscription.getFrequency().name(),

                        subscription.getStatus().name(),

                        subscription.getStartDate(),

                        subscription.getEndDate()

                ))
                .toList();

    }
}