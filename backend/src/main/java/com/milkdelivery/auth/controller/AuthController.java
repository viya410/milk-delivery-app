package com.milkdelivery.auth.controller;

import com.milkdelivery.auth.dto.*;
import com.milkdelivery.auth.service.AuthService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(
            AuthService authService
    ) {

        this.authService = authService;

    }

    @PostMapping("/register")
    public void register(

            @RequestBody RegisterRequest request

    ) {

        authService.register(
                request
        );

    }

    @PostMapping("/login")
    public AuthResponse login(

            @RequestBody LoginRequest request

    ) {

        return authService.login(
                request
        );

    }

}