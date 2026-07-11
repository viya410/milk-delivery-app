package com.milkdelivery.order.controller;

import com.milkdelivery.order.dto.PlaceOrderRequest;
import com.milkdelivery.order.entity.Order;
import com.milkdelivery.order.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.milkdelivery.order.dto.OrderResponse;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public Order placeOrder(
            @RequestBody PlaceOrderRequest request,
            Authentication authentication
    ) {
        return orderService.placeOrder(request, authentication);
    }

    @GetMapping
    public List<OrderResponse> getOrders(Authentication authentication) {
        return orderService.getOrders(authentication);
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            @PathVariable Long orderId,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                orderService.cancelOrder(orderId, authentication)
        );
    }
}