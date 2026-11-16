package com.milkdelivery.deliverypartner.controller;

import com.milkdelivery.deliverypartner.dto.request.CreateDeliveryPartnerRequest;
import com.milkdelivery.deliverypartner.dto.response.DeliveryPartnerResponse;
import com.milkdelivery.deliverypartner.service.DeliveryPartnerService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import com.milkdelivery.order.dto.OrderResponse;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/admin/delivery-partners")
public class DeliveryPartnerController {

    private final DeliveryPartnerService deliveryPartnerService;

    public DeliveryPartnerController(
            DeliveryPartnerService deliveryPartnerService
    ) {
        this.deliveryPartnerService = deliveryPartnerService;
    }

    @PostMapping
    public DeliveryPartnerResponse createDeliveryPartner(
            @Valid @RequestBody CreateDeliveryPartnerRequest request
    ) {
        return deliveryPartnerService.createDeliveryPartner(request);
    }

    @GetMapping("/orders/available")
    public List<OrderResponse> getAvailableOrders(
            Authentication authentication
    ) {
        return deliveryPartnerService.getAvailableOrders(authentication);
    }
}