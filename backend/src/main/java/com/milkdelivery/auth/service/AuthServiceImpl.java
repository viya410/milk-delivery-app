package com.milkdelivery.auth.service;

import com.milkdelivery.auth.dto.AuthResponse;
import com.milkdelivery.auth.dto.LoginRequest;
import com.milkdelivery.auth.dto.RegisterRequest;
import com.milkdelivery.security.JwtService;
import com.milkdelivery.user.dto.UserResponse;
import com.milkdelivery.user.entity.Role;
import com.milkdelivery.user.entity.User;
import com.milkdelivery.user.repository.UserRepository;
import com.milkdelivery.user.service.CustomUserDetailsService;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;

    private final CustomUserDetailsService customUserDetailsService;

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            CustomUserDetailsService customUserDetailsService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Override
    public void register(RegisterRequest request) {

        if (request.getEmail() != null
                && !request.getEmail().isBlank()
                && userRepository.existsByEmail(request.getEmail())) {

            throw new RuntimeException("Email already exists");
        }

        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException("Phone number already exists");
        }

        User user = new User();

        user.setFullName(request.getFullName());

        user.setEmail(
                request.getEmail() != null && !request.getEmail().isBlank()
                        ? request.getEmail()
                        : null
        );

        user.setPhoneNumber(request.getPhoneNumber());

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setRole(Role.ROLE_USER);

        userRepository.save(user);
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getUsername())
                .or(() -> userRepository.findByPhoneNumber(request.getUsername()))
                .orElseThrow(() -> new RuntimeException("User not found"));

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        UserDetails userDetails =
                new org.springframework.security.core.userdetails.User(
                        user.getEmail() != null
                                ? user.getEmail()
                                : user.getPhoneNumber(),
                        user.getPassword(),
                        java.util.List.of(
                                new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                        user.getRole().name()
                                )
                        )
                );

        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(
                token,
                toUserResponse(user)
        );
    }

    private UserResponse toUserResponse(User user) {

        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRole()
        );
    }
}