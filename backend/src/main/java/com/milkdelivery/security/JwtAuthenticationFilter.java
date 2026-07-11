package com.milkdelivery.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.milkdelivery.user.service.CustomUserDetailsService;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;

    private final CustomUserDetailsService customUserDetailsService;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            CustomUserDetailsService customUserDetailsService
    ) {

        this.jwtService = jwtService;

        this.customUserDetailsService = customUserDetailsService;

    }

    @Override
    protected void doFilterInternal(

            HttpServletRequest request,

            HttpServletResponse response,

            FilterChain filterChain

    ) throws ServletException, IOException {
        String path = request.getServletPath();

        System.out.println("========== REQUEST ==========");
        System.out.println(request.getMethod() + " " + path);
        System.out.println("=============================");

        if (

                path.startsWith("/api/auth")

        ) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;

        }

        final String authHeader =
                request.getHeader(
                        "Authorization"
                );

        if (

                authHeader == null ||

                        !authHeader.startsWith(
                                "Bearer "
                        )

        ) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;

        }

        String token =
                authHeader.substring(7);
        System.out.println("JWT Token = " + token);

        String email =
                jwtService.extractUsername(
                        token
                );
        System.out.println("JWT Subject = " + email);

        if (

                email != null &&

                        SecurityContextHolder
                                .getContext()
                                .getAuthentication() == null

        ) {
            System.out.println("Looking up user: " + email);

            UserDetails userDetails =
                    customUserDetailsService
                            .loadUserByUsername(
                                    email
                            );
            System.out.println(userDetails.getAuthorities());

            UsernamePasswordAuthenticationToken authToken =

                    new UsernamePasswordAuthenticationToken(

                            userDetails,

                            null,

                            userDetails.getAuthorities()

                    );

            authToken.setDetails(

                    new WebAuthenticationDetailsSource()
                            .buildDetails(
                                    request
                            )

            );

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(
                            authToken
                    );

        }

        filterChain.doFilter(
                request,
                response
        );

    }

}