package com.milkdelivery.auth.service;

import com.milkdelivery.auth.dto.*;

public interface AuthService {

    void register(
            RegisterRequest request
    );

    AuthResponse login(
            LoginRequest request
    );

}