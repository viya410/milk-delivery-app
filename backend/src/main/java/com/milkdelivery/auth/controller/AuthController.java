package com.milkdelivery.auth.controller;

import com.milkdelivery.auth.dto.AuthResponse;
import com.milkdelivery.auth.dto.ForgotPasswordRequest;
import com.milkdelivery.auth.dto.LoginRequest;
import com.milkdelivery.auth.dto.RegisterRequest;
import com.milkdelivery.auth.dto.ResetPasswordRequest;
import com.milkdelivery.auth.service.AuthService;
import com.milkdelivery.auth.service.PasswordResetService;
import com.milkdelivery.deliverypartner.dto.request.DeliveryPartnerRegisterRequest;
import com.milkdelivery.deliverypartner.service.DeliveryPartnerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final DeliveryPartnerService deliveryPartnerService;
    private final PasswordResetService passwordResetService;

    public AuthController(AuthService authService, DeliveryPartnerService deliveryPartnerService, PasswordResetService passwordResetService) {
        this.authService = authService; this.deliveryPartnerService = deliveryPartnerService; this.passwordResetService = passwordResetService;
    }
    @PostMapping("/register") public void register(@RequestBody RegisterRequest request) { authService.register(request); }
    @PostMapping("/delivery-partner/register") public void registerDeliveryPartner(@Valid @RequestBody DeliveryPartnerRegisterRequest request) { deliveryPartnerService.registerDeliveryPartner(request); }
    @PostMapping("/login") public AuthResponse login(@RequestBody LoginRequest request) { return authService.login(request); }
    @PostMapping("/forgot-password") @ResponseStatus(HttpStatus.OK)
    public void forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) { passwordResetService.requestReset(request); }
    @PostMapping("/reset-password") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void resetPassword(@Valid @RequestBody ResetPasswordRequest request) { passwordResetService.resetPassword(request); }
}
