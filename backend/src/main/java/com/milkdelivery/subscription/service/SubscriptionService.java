package com.milkdelivery.subscription.service;

import com.milkdelivery.exception.InsufficientStockException;
import com.milkdelivery.inventory.service.InventoryService;
import com.milkdelivery.order.entity.Order;
import com.milkdelivery.order.entity.OrderItem;
import com.milkdelivery.order.entity.OrderStatus;
import com.milkdelivery.product.entity.Product;
import com.milkdelivery.product.repository.ProductRepository;
import com.milkdelivery.subscription.dto.SubscriptionRequest;
import com.milkdelivery.subscription.dto.SubscriptionResponse;
import com.milkdelivery.subscription.entity.Subscription;
import com.milkdelivery.subscription.entity.SubscriptionStatus;
import com.milkdelivery.subscription.mapper.SubscriptionMapper;
import com.milkdelivery.subscription.repository.SubscriptionRepository;
import com.milkdelivery.user.entity.User;
import com.milkdelivery.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import com.milkdelivery.order.repository.OrderRepository;
import com.milkdelivery.address.entity.Address;
import com.milkdelivery.address.repository.AddressRepository;

import java.time.LocalDateTime;
import java.util.Collections;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@Transactional
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final SubscriptionMapper mapper;
    private final InventoryService inventoryService;
    private final OrderRepository orderRepository;
    private final AddressRepository addressRepository;

    public SubscriptionService(
            SubscriptionRepository subscriptionRepository,
            ProductRepository productRepository,
            UserRepository userRepository,
            SubscriptionMapper mapper,
            InventoryService inventoryService,
            OrderRepository orderRepository,
            AddressRepository addressRepository
    ) {
        this.subscriptionRepository = subscriptionRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
        this.inventoryService = inventoryService;
        this.orderRepository = orderRepository;
        this.addressRepository = addressRepository;
    }

    private User getCurrentUser(Authentication authentication) {

        String username = authentication.getName();

        return userRepository.findByEmail(username)
                .or(() -> userRepository.findByPhoneNumber(username))
                .orElseThrow();

    }

    public SubscriptionResponse create(
            SubscriptionRequest request,
            Authentication authentication
    ) {

        User user = getCurrentUser(authentication);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow();

        Subscription subscription = new Subscription();

        subscription.setUser(user);
        subscription.setProduct(product);
        subscription.setQuantity(request.getQuantity());
        subscription.setFrequency(request.getFrequency());
        subscription.setStartDate(request.getStartDate());
        subscription.setEndDate(request.getEndDate());

        return mapper.toResponse(
                subscriptionRepository.save(subscription)
        );

    }

    public List<SubscriptionResponse> getMySubscriptions(
            Authentication authentication
    ) {

        User user = getCurrentUser(authentication);

        return subscriptionRepository.findByUser(user)
                .stream()
                .map(mapper::toResponse)
                .toList();

    }

    public SubscriptionResponse updateStatus(
            Long id,
            SubscriptionStatus status,
            Authentication authentication
    ) {

        User user = getCurrentUser(authentication);

        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow();

        if (!subscription.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Subscription does not belong to the user.");
        }

        subscription.setStatus(status);

        return mapper.toResponse(
                subscriptionRepository.save(subscription)
        );

    }

    public void generateTodayOrders() {

        LocalDate today = LocalDate.now();

        LocalDateTime startOfDay = today.atStartOfDay();

        LocalDateTime endOfDay = today.atTime(23, 59, 59);

        List<Subscription> subscriptions =
                subscriptionRepository.findByStatus(SubscriptionStatus.ACTIVE);

        for (Subscription subscription : subscriptions) {

            if (!shouldGenerateOrder(subscription, startOfDay, endOfDay)) {
                continue;
            }

            try {

                createOrderForSubscription(subscription);

            } catch (InsufficientStockException ex) {

                System.out.println(
                        "Insufficient stock for subscription "
                                + subscription.getId()
                );

            }

        }

    }

    private boolean isDueToday(Subscription subscription) {

        LocalDate today = LocalDate.now();

        if (subscription.getStartDate().isAfter(today)) {
            return false;
        }

        if (subscription.getEndDate() != null &&
                subscription.getEndDate().isBefore(today)) {
            return false;
        }

        long days = ChronoUnit.DAYS.between(
                subscription.getStartDate(),
                today
        );

        return switch (subscription.getFrequency()) {

            case DAILY -> true;

            case ALTERNATE_DAY -> days % 2 == 0;

            case WEEKLY -> days % 7 == 0;

        };

    }

    private boolean shouldGenerateOrder(
            Subscription subscription,
            LocalDateTime startOfDay,
            LocalDateTime endOfDay
    ) {

        if (!isDueToday(subscription)) {
            return false;
        }

        return !orderRepository.existsBySubscriptionAndOrderDateBetween(
                subscription,
                startOfDay,
                endOfDay
        );

    }

    private void createOrderForSubscription(
            Subscription subscription
    ) {

        Address address = addressRepository
                .findFirstByUser(subscription.getUser())
                .orElse(null);

        if (address == null) {

            System.out.println(
                    "Skipping subscription "
                            + subscription.getId()
                            + " because no address exists."
            );

            return;

        }

        inventoryService.reserveStock(
                subscription.getProduct(),
                subscription.getQuantity(),
                "Subscription Reservation",
                "SUB-" + subscription.getId()
        );

        Order order = new Order();

        order.setSubscription(subscription);

        order.setUser(subscription.getUser());

        order.setAddress(address);

        order.setOrderDate(LocalDateTime.now());

        order.setStatus(OrderStatus.PLACED);

        order.setTotalAmount(
                subscription.getQuantity()
                        * subscription.getProduct().getPrice()
        );

        OrderItem item = new OrderItem();

        item.setOrder(order);

        item.setProduct(subscription.getProduct());

        item.setQuantity(subscription.getQuantity().intValue());

        order.setItems(Collections.singletonList(item));

        orderRepository.save(order);

    }
}