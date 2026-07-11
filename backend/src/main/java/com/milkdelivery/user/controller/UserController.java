package com.milkdelivery.user.controller;

import com.milkdelivery.user.dto.UserResponse;
import com.milkdelivery.user.entity.User;
import com.milkdelivery.user.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(
            UserRepository userRepository
    ) {

        this.userRepository = userRepository;

    }
    private User getCurrentUser(
            Authentication authentication
    ) {

        String username =
                authentication.getName();

        return userRepository

                .findByEmail(username)

                .orElse(

                        userRepository

                                .findByPhoneNumber(username)

                                .orElseThrow()

                );

    }
    @GetMapping("/me")
    public UserResponse me(
            Authentication authentication
    ) {

        User user =
                getCurrentUser(authentication);

        return new UserResponse(

                user.getId(),

                user.getFullName(),

                user.getEmail(),

                user.getPhoneNumber(),

                user.getRole()

        );

    }

}