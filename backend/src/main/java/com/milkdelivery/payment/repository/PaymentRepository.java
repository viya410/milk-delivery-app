package com.milkdelivery.payment.repository;

import com.milkdelivery.payment.entity.Payment;

import org.springframework.data.jpa.repository.JpaRepository;
import com.milkdelivery.user.entity.User;

import java.util.List;
import java.util.Optional;


public interface PaymentRepository
        extends JpaRepository<Payment, Long> {

    Optional<Payment> findByRazorpayOrderIdAndUser(String razorpayOrderId, User user);

    List<Payment> findByUser(
            User user
    );
}