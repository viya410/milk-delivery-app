package com.milkdelivery.payment.repository;

import com.milkdelivery.payment.entity.Payment;

import org.springframework.data.jpa.repository.JpaRepository;
import com.milkdelivery.user.entity.User;

import java.util.List;


public interface PaymentRepository
        extends JpaRepository<Payment, Long> {

    List<Payment> findByUser(
            User user
    );
}