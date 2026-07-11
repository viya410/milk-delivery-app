package com.milkdelivery.payment.service;

import com.milkdelivery.payment.dto.PaymentOrderResponse;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.milkdelivery.payment.dto.VerifyPaymentRequest;
import com.razorpay.Utils;
import com.milkdelivery.payment.dto.PaymentRequest;
import com.milkdelivery.payment.entity.Payment;
import com.milkdelivery.payment.entity.PaymentStatus;
import com.milkdelivery.payment.repository.PaymentRepository;

import java.time.LocalDateTime;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    @Value("${razorpay.key-id}")
    private String keyId;

    @Value("${razorpay.key-secret}")
    private String keySecret;

    public PaymentService(
            PaymentRepository paymentRepository
    ) {

        this.paymentRepository =
                paymentRepository;

    }

    public PaymentOrderResponse createOrder(
            Double amount
    ) throws Exception {

        RazorpayClient razorpayClient =
                new RazorpayClient(
                        keyId,
                        keySecret
                );

        JSONObject orderRequest =
                new JSONObject();

        orderRequest.put(
                "amount",
                amount * 100
        );

        orderRequest.put(
                "currency",
                "INR"
        );

        orderRequest.put(
                "receipt",
                "txn_" + System.currentTimeMillis()
        );

        Order order =
                razorpayClient
                        .orders
                        .create(orderRequest);

        return new PaymentOrderResponse(

                order.get("id"),

                order.get("amount"),

                order.get("currency")

        );

    }
    public boolean verifyPayment(
            VerifyPaymentRequest request
    ) throws Exception {

        JSONObject options =
                new JSONObject();

        options.put(
                "razorpay_order_id",
                request.getRazorpayOrderId()
        );

        options.put(
                "razorpay_payment_id",
                request.getRazorpayPaymentId()
        );

        options.put(
                "razorpay_signature",
                request.getRazorpaySignature()
        );

        return Utils.verifyPaymentSignature(
                options,
                keySecret
        );

    }

    public Payment savePayment(
            PaymentRequest request
    ) {

        Payment payment =
                new Payment();

        payment.setRazorpayPaymentId(
                request.getRazorpayPaymentId()
        );

        payment.setRazorpayOrderId(
                request.getRazorpayOrderId()
        );

        payment.setAmount(
                request.getAmount()
        );

        payment.setStatus(
                PaymentStatus.SUCCESS
        );

        payment.setPaymentDate(
                LocalDateTime.now()
        );

        return paymentRepository.save(
                payment
        );

    }

}