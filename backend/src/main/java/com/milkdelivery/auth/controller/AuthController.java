package com.milkdelivery.auth.controller;

import com.milkdelivery.auth.dto.AuthResponse;
import com.milkdelivery.auth.dto.LoginRequest;
import com.milkdelivery.auth.dto.RegisterRequest;
import com.milkdelivery.auth.service.AuthService;
import com.milkdelivery.deliverypartner.dto.request.DeliveryPartnerRegisterRequest;
import com.milkdelivery.deliverypartner.service.DeliveryPartnerService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final DeliveryPartnerService deliveryPartnerService;

    public AuthController(
            AuthService authService,
            DeliveryPartnerService deliveryPartnerService
    ) {
        this.authService = authService;
        this.deliveryPartnerService = deliveryPartnerService;
    }

    @PostMapping("/register")
    public void register(
            @RequestBody RegisterRequest request
    ) {
        authService.register(request);
    }

    @PostMapping("/delivery-partner/register")
    public void registerDeliveryPartner(
            @RequestBody DeliveryPartnerRegisterRequest request
    ) {
        deliveryPartnerService.registerDeliveryPartner(request);
    }

    @PostMapping("/login")
    public AuthResponse login(
            @RequestBody LoginRequest request
    ) {
        return authService.login(request);
    }
}