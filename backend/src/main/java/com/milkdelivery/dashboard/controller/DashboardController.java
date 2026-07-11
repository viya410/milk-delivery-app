package com.milkdelivery.dashboard.controller;

import com.milkdelivery.address.repository.AddressRepository;
import com.milkdelivery.dashboard.dto.DashboardSummaryResponse;
import com.milkdelivery.order.repository.OrderRepository;
import com.milkdelivery.user.entity.User;
import com.milkdelivery.user.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final UserRepository userRepository;

    private final OrderRepository orderRepository;

    private final AddressRepository addressRepository;

    public DashboardController(
            UserRepository userRepository,
            OrderRepository orderRepository,
            AddressRepository addressRepository
    ) {

        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.addressRepository = addressRepository;

    }

    private User getCurrentUser(
            Authentication authentication
    ) {

        String username = authentication.getName();

        return userRepository

                .findByEmail(username)

                .or(() ->

                        userRepository.findByPhoneNumber(username)

                )

                .orElseThrow();

    }

    @GetMapping("/summary")
    public DashboardSummaryResponse getSummary(
            Authentication authentication
    ) {

        User user = getCurrentUser(authentication);

        long totalOrders =
                orderRepository.countByUser(user);

        long totalAddresses =
                addressRepository.countByUser(user);

        long activePlans = 1;

        return new DashboardSummaryResponse(

                totalOrders,
                activePlans,

                totalAddresses
        );

    }

}