package com.milkdelivery.deliverypartner.controller;

import com.milkdelivery.deliverypartner.dto.request.VerifyOtpRequest;
import com.milkdelivery.deliverypartner.dto.response.DeliveryPartnerDashboardResponse;
import com.milkdelivery.deliverypartner.service.DeliveryPartnerService;
import com.milkdelivery.order.dto.OrderResponse;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/delivery-partner")
public class DeliveryPartnerOrderController {

    private final DeliveryPartnerService deliveryPartnerService;

    public DeliveryPartnerOrderController(
            DeliveryPartnerService deliveryPartnerService
    ) {
        this.deliveryPartnerService = deliveryPartnerService;
    }

    @GetMapping("/orders/available")
    public List<OrderResponse> getAvailableOrders(
            Authentication authentication
    ) {
        return deliveryPartnerService.getAvailableOrders(authentication);
    }

    @GetMapping("/orders/my")
    public List<OrderResponse> getMyOrders(
            Authentication authentication
    ) {
        return deliveryPartnerService.getMyOrders(authentication);
    }

    @PostMapping("/orders/{orderId}/pick")
    public OrderResponse pickOrder(
            @PathVariable Long orderId,
            Authentication authentication
    ) {
        return deliveryPartnerService.pickOrder(
                orderId,
                authentication
        );
    }

    @PostMapping("/orders/{orderId}/verify-otp")
    public OrderResponse verifyOtp(
            @PathVariable Long orderId,
            @RequestBody VerifyOtpRequest request,
            Authentication authentication
    ) {

        return deliveryPartnerService.verifyOtp(
                orderId,
                request,
                authentication
        );
    }

    @GetMapping("/dashboard")
    public DeliveryPartnerDashboardResponse getDashboard(
            Authentication authentication
    ) {
        return deliveryPartnerService.getDashboard(authentication);
    }
}