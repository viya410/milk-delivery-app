package com.milkdelivery.user.repository;

import com.milkdelivery.user.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository
        extends JpaRepository<User, Long> {

    Optional<User> findByEmail(
            String email
    );

    Optional<User> findByEmailIgnoreCase(String email);

    Optional<User> findByPhoneNumber(
            String phoneNumber
    );

    boolean existsByEmail(
            String email
    );

    boolean existsByPhoneNumber(
            String phoneNumber
    );
}