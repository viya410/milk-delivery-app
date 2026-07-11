package com.milkdelivery.config;

import com.milkdelivery.user.service.CustomUserDetailsService;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class ApplicationConfig {

    private final CustomUserDetailsService customUserDetailsService;

    public ApplicationConfig(
            CustomUserDetailsService customUserDetailsService
    ) {

        this.customUserDetailsService =
                customUserDetailsService;

    }

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();

    }

    @Bean
    public AuthenticationManager authenticationManager() {

        DaoAuthenticationProvider provider =

                new DaoAuthenticationProvider();

        provider.setUserDetailsService(

                customUserDetailsService

        );

        provider.setPasswordEncoder(

                passwordEncoder()

        );

        return new ProviderManager(

                provider

        );

    }

}