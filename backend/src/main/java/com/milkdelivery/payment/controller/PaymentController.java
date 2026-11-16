package com.milkdelivery.payment.controller;

import com.milkdelivery.cart.entity.CartItem;
import com.milkdelivery.cart.repository.CartItemRepository;
import com.milkdelivery.payment.dto.CreateOrderRequest;
import com.milkdelivery.payment.dto.PaymentOrderResponse;
import com.milkdelivery.payment.dto.PaymentRequest;
import com.milkdelivery.payment.dto.VerifyPaymentRequest;
import com.milkdelivery.payment.entity.Payment;
import com.milkdelivery.payment.repository.PaymentRepository;
import com.milkdelivery.payment.service.PaymentService;
import com.milkdelivery.user.entity.User;
import com.milkdelivery.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;

    public PaymentController(PaymentService paymentService,
                             PaymentRepository paymentRepository,
                             UserRepository userRepository,
                             CartItemRepository cartItemRepository) {
        this.paymentService = paymentService;
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.cartItemRepository = cartItemRepository;
    }

    private User currentUser(Authentication authentication) {
        String username = authentication.getName();
        return userRepository.findByEmail(username)
                .or(() -> userRepository.findByPhoneNumber(username))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Customer account not found."));
    }

    private double currentCartTotal(User user) {
        List<CartItem> items = cartItemRepository.findByUser(user);
        if (items.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cart is empty.");
        }
        return items.stream().mapToDouble(item -> {
            double price = item.getProductSize() != null
                    ? item.getProductSize().getPrice()
                    : item.getProduct().getPrice();
            return price * item.getQuantity();
        }).sum();
    }

    @PostMapping("/create-order")
    public PaymentOrderResponse createOrder(@RequestBody CreateOrderRequest request,
                                            Authentication authentication) throws Exception {
        double total = currentCartTotal(currentUser(authentication));
        return paymentService.createOrder(total);
    }

    @PostMapping("/verify")
    public boolean verifyPayment(@RequestBody VerifyPaymentRequest request) throws Exception {
        return paymentService.verifyPayment(request);
    }

    @PostMapping
    public Payment savePayment(@RequestBody PaymentRequest request,
                               Authentication authentication) throws Exception {
        User user = currentUser(authentication);
        VerifyPaymentRequest verification = new VerifyPaymentRequest();
        verification.setRazorpayOrderId(request.getRazorpayOrderId());
        verification.setRazorpayPaymentId(request.getRazorpayPaymentId());
        verification.setRazorpaySignature(request.getRazorpaySignature());
        if (!paymentService.verifyPayment(verification)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment signature verification failed.");
        }

        PaymentRequest trustedRequest = new PaymentRequest();
        trustedRequest.setRazorpayOrderId(request.getRazorpayOrderId());
        trustedRequest.setRazorpayPaymentId(request.getRazorpayPaymentId());
        trustedRequest.setAmount(currentCartTotal(user));

        Payment payment = paymentService.savePayment(trustedRequest);
        payment.setUser(user);
        return paymentRepository.save(payment);
    }

    @GetMapping
    public List<Payment> getPayments(Authentication authentication) {
        return paymentRepository.findByUser(currentUser(authentication));
    }
}
