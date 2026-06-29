package com.milkdelivery.payment.controller;

import com.milkdelivery.payment.dto.CreateOrderRequest;
import com.milkdelivery.payment.dto.PaymentOrderResponse;
import com.milkdelivery.payment.dto.PaymentRequest;
import com.milkdelivery.payment.dto.VerifyPaymentRequest;
import com.milkdelivery.payment.entity.Payment;
import com.milkdelivery.payment.repository.PaymentRepository;
import com.milkdelivery.payment.service.PaymentService;

import com.milkdelivery.user.entity.User;
import com.milkdelivery.user.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentService paymentService;

    private final PaymentRepository paymentRepository;

    private final UserRepository userRepository;

    public PaymentController(

            PaymentService paymentService,

            PaymentRepository paymentRepository,

            UserRepository userRepository

    ) {

        this.paymentService = paymentService;

        this.paymentRepository = paymentRepository;

        this.userRepository = userRepository;

    }

    @PostMapping("/create-order")
    public PaymentOrderResponse createOrder(

            @RequestBody CreateOrderRequest request

    ) throws Exception {

        return paymentService.createOrder(

                request.getAmount()

        );

    }

    @PostMapping("/verify")
    public boolean verifyPayment(

            @RequestBody VerifyPaymentRequest request

    ) throws Exception {

        return paymentService.verifyPayment(

                request

        );

    }

    @PostMapping
    public Payment savePayment(

            @RequestBody PaymentRequest request,

            Authentication authentication

    ) {

        Payment payment =

                paymentService.savePayment(

                        request

                );

        User user =

                userRepository

                        .findByEmail(

                                authentication.getName()

                        )

                        .orElseThrow();

        payment.setUser(

                user

        );

        return paymentRepository.save(

                payment

        );

    }

    @GetMapping
    public List<Payment> getPayments(

            Authentication authentication

    ) {

        User user =

                userRepository

                        .findByEmail(

                                authentication.getName()

                        )

                        .orElseThrow();

        return paymentRepository.findByUser(

                user

        );

    }

}
