package com.milkdelivery.deliverypartner.service;

import com.milkdelivery.deliverypartner.dto.request.CreateDeliveryPartnerRequest;
import com.milkdelivery.deliverypartner.dto.request.DeliveryPartnerRegisterRequest;
import com.milkdelivery.deliverypartner.dto.request.VerifyOtpRequest;
import com.milkdelivery.deliverypartner.dto.response.DeliveryPartnerDashboardResponse;
import com.milkdelivery.deliverypartner.dto.response.DeliveryPartnerResponse;
import com.milkdelivery.deliverypartner.entity.DeliveryPartner;
import com.milkdelivery.deliverypartner.entity.DeliveryPartnerStatus;
import com.milkdelivery.deliverypartner.repository.DeliveryPartnerRepository;
import com.milkdelivery.exception.BusinessException;
import com.milkdelivery.exception.DeliveryPartnerAlreadyExistsException;
import com.milkdelivery.exception.OrderNotFoundException;
import com.milkdelivery.exception.RouteNotFoundException;
import com.milkdelivery.inventory.service.InventoryService;
import com.milkdelivery.order.dto.OrderResponse;
import com.milkdelivery.order.entity.OrderItem;
import com.milkdelivery.route.entity.Route;
import com.milkdelivery.route.repository.RouteRepository;
import com.milkdelivery.user.entity.Role;
import com.milkdelivery.user.entity.User;
import com.milkdelivery.user.repository.UserRepository;
import com.milkdelivery.util.OtpUtil;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.milkdelivery.order.entity.Order;
import com.milkdelivery.order.entity.OrderStatus;
import com.milkdelivery.order.mapper.OrderMapper;
import com.milkdelivery.order.repository.OrderRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class DeliveryPartnerServiceImpl implements DeliveryPartnerService {

    private final DeliveryPartnerRepository deliveryPartnerRepository;
    private final UserRepository userRepository;
    private final RouteRepository routeRepository;
    private final PasswordEncoder passwordEncoder;
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final InventoryService inventoryService;

    public DeliveryPartnerServiceImpl(
            DeliveryPartnerRepository deliveryPartnerRepository,
            UserRepository userRepository,
            RouteRepository routeRepository,
            PasswordEncoder passwordEncoder,
            OrderRepository orderRepository,
            OrderMapper orderMapper,
            InventoryService inventoryService
    ) {
        this.deliveryPartnerRepository = deliveryPartnerRepository;
        this.userRepository = userRepository;
        this.routeRepository = routeRepository;
        this.passwordEncoder = passwordEncoder;
        this.orderRepository = orderRepository;
        this.orderMapper = orderMapper;
        this.inventoryService = inventoryService;
    }

    @Override
    public DeliveryPartnerResponse createDeliveryPartner(
            CreateDeliveryPartnerRequest request
    ) {

        if (deliveryPartnerRepository.existsByEmployeeCode(request.getEmployeeCode())) {
            throw new DeliveryPartnerAlreadyExistsException(
                    "employee code",
                    request.getEmployeeCode()
            );
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DeliveryPartnerAlreadyExistsException(
                    "email",
                    request.getEmail()
            );
        }

        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new DeliveryPartnerAlreadyExistsException(
                    "phone number",
                    request.getPhoneNumber()
            );
        }

        Route route = routeRepository
                .findById(request.getRouteId())
                .orElseThrow(() ->
                        new RouteNotFoundException(request.getRouteId())
                );

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ROLE_DELIVERY_PARTNER);

        User savedUser = userRepository.save(user);

        DeliveryPartner deliveryPartner = new DeliveryPartner();

        deliveryPartner.setUser(savedUser);
        deliveryPartner.setEmployeeCode(request.getEmployeeCode());
        deliveryPartner.setRoute(route);
        deliveryPartner.setStatus(DeliveryPartnerStatus.ACTIVE);

        DeliveryPartner savedPartner =
                deliveryPartnerRepository.save(deliveryPartner);

        DeliveryPartnerResponse response =
                new DeliveryPartnerResponse();

        response.setId(savedPartner.getId());
        response.setFullName(savedUser.getFullName());
        response.setEmail(savedUser.getEmail());
        response.setPhoneNumber(savedUser.getPhoneNumber());
        response.setEmployeeCode(savedPartner.getEmployeeCode());
        response.setRouteId(route.getId());
        response.setRouteName(route.getRouteName());
        response.setStatus(savedPartner.getStatus());

        return response;
    }

    @Override
    public void registerDeliveryPartner(
            DeliveryPartnerRegisterRequest request
    ) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DeliveryPartnerAlreadyExistsException(
                    "email",
                    request.getEmail()
            );
        }

        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new DeliveryPartnerAlreadyExistsException(
                    "phone number",
                    request.getPhoneNumber()
            );
        }

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ROLE_DELIVERY_PARTNER);

        User savedUser = userRepository.save(user);

        DeliveryPartner deliveryPartner = new DeliveryPartner();

        deliveryPartner.setUser(savedUser);
        deliveryPartner.setStatus(DeliveryPartnerStatus.ACTIVE);

        deliveryPartnerRepository.save(deliveryPartner);
    }

    @Override
    public List<OrderResponse> getAvailableOrders(
            Authentication authentication
    ) {

        return orderRepository
                .findByStatusAndDeliveryPartnerIsNullOrderByOrderDateAsc(
                        OrderStatus.PACKED
                )
                .stream()
                .map(orderMapper::toOrderResponse)
                .toList();
    }

    @Override
    public List<OrderResponse> getMyOrders(
            Authentication authentication
    ) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new BusinessException("User not found.")
                );

        DeliveryPartner deliveryPartner = deliveryPartnerRepository
                .findByUserId(user.getId())
                .orElseThrow(() ->
                        new BusinessException("Delivery partner not found.")
                );

        return orderRepository
                .findByDeliveryPartnerOrderByOrderDateDesc(
                        deliveryPartner
                )
                .stream()
                .map(orderMapper::toOrderResponse)
                .toList();
    }

    @Override
    public OrderResponse pickOrder(
            Long orderId,
            Authentication authentication
    ) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new BusinessException("User not found.")
                );

        DeliveryPartner deliveryPartner = deliveryPartnerRepository
                .findByUserId(user.getId())
                .orElseThrow(() ->
                        new BusinessException("Delivery partner not found.")
                );

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new OrderNotFoundException(orderId)
                );

        if (order.getStatus() != OrderStatus.PACKED) {
            throw new BusinessException(
                    "Only packed orders can be picked."
            );
        }

        if (order.getDeliveryPartner() != null) {
            throw new BusinessException(
                    "Order has already been assigned."
            );
        }

        order.setDeliveryPartner(deliveryPartner);
        order.setStatus(OrderStatus.OUT_FOR_DELIVERY);
        order.setPickedAt(java.time.LocalDateTime.now());
        order.setDeliveryOtp(OtpUtil.generateOtp());

        order.setOtpGeneratedAt(LocalDateTime.now());
        System.out.println(
                "Delivery OTP for Order "
                        + order.getId()
                        + " : "
                        + order.getDeliveryOtp()
        );

        for (OrderItem item : order.getItems()) {

            inventoryService.consumeReservedStock(
                    item.getProduct(),
                    item.getQuantity()
            );
        }

        order.setOtpVerified(false);

        Order savedOrder = orderRepository.save(order);

        return orderMapper.toOrderResponse(savedOrder);
    }

    @Override
    public OrderResponse verifyOtp(
            Long orderId,
            VerifyOtpRequest request,
            Authentication authentication
    ) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new BusinessException("User not found.")
                );

        DeliveryPartner deliveryPartner = deliveryPartnerRepository
                .findByUserId(user.getId())
                .orElseThrow(() ->
                        new BusinessException("Delivery partner not found.")
                );

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new OrderNotFoundException(orderId)
                );

        if (order.getDeliveryPartner() == null ||
                !order.getDeliveryPartner().getId().equals(deliveryPartner.getId())) {

            throw new BusinessException(
                    "This order is not assigned to you."
            );
        }

        if (order.getStatus() != OrderStatus.OUT_FOR_DELIVERY) {
            throw new BusinessException(
                    "Order is not out for delivery."
            );
        }

        if (order.getDeliveryOtp() == null) {
            throw new BusinessException(
                    "No OTP has been generated for this order."
            );
        }

        if (order.getOtpGeneratedAt()
                .plusMinutes(5)
                .isBefore(LocalDateTime.now())) {

            throw new BusinessException(
                    "OTP has expired."
            );
        }

        if (!order.getDeliveryOtp().equals(request.getOtp())) {
            throw new BusinessException(
                    "Invalid OTP."
            );
        }

        order.setOtpVerified(true);

        order.setStatus(OrderStatus.DELIVERED);

        order.setDeliveredAt(LocalDateTime.now());

        order.setDeliveryOtp(null);
        order.setOtpGeneratedAt(null);

        Order savedOrder = orderRepository.save(order);

        return orderMapper.toOrderResponse(savedOrder);
    }

    @Override
    public DeliveryPartnerDashboardResponse getDashboard(
            Authentication authentication
    ) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new BusinessException("User not found.")
                );

        DeliveryPartner deliveryPartner = deliveryPartnerRepository
                .findByUserId(user.getId())
                .orElseThrow(() ->
                        new BusinessException("Delivery partner not found.")
                );

        LocalDate today = LocalDate.now();

        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();

        DeliveryPartnerDashboardResponse response =
                new DeliveryPartnerDashboardResponse();

        response.setStatus(deliveryPartner.getStatus());

        response.setAvailableOrders(
                orderRepository.countByStatusAndDeliveryPartnerIsNull(
                        OrderStatus.PACKED
                )
        );

        response.setAssignedOrders(
                orderRepository.countByDeliveryPartnerAndStatus(
                        deliveryPartner,
                        OrderStatus.OUT_FOR_DELIVERY
                )
        );

        response.setCompletedToday(
                orderRepository.countByDeliveryPartnerAndStatusAndDeliveredAtBetween(
                        deliveryPartner,
                        OrderStatus.DELIVERED,
                        startOfDay,
                        endOfDay
                )
        );

        return response;
    }
}