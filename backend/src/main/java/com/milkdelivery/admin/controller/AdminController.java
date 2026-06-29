package com.milkdelivery.admin.controller;

import com.milkdelivery.order.entity.Order;
import com.milkdelivery.order.repository.OrderRepository;
import com.milkdelivery.user.entity.User;
import com.milkdelivery.user.repository.UserRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;

    private final OrderRepository orderRepository;

    public AdminController(

            UserRepository userRepository,

            OrderRepository orderRepository

    ) {

        this.userRepository = userRepository;

        this.orderRepository = orderRepository;

    }

    @GetMapping("/users")
    public List<User> getUsers() {

        return userRepository.findAll();

    }

    @GetMapping("/orders")
    public List<Order> getOrders() {

        return orderRepository.findAll();

    }

    @PutMapping("/orders/{id}/status")
    public Order updateStatus(

            @PathVariable Long id,

            @RequestParam String status

    ) {

        Order order =

                orderRepository

                        .findById(

                                id

                        )

                        .orElseThrow();

        order.setStatus(

                status

        );

        return orderRepository.save(

                order

        );

    }

}