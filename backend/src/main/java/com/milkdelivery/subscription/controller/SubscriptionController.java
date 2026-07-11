package com.milkdelivery.subscription.controller;

import com.milkdelivery.subscription.dto.SubscriptionRequest;
import com.milkdelivery.subscription.dto.SubscriptionResponse;
import com.milkdelivery.subscription.entity.SubscriptionStatus;
import com.milkdelivery.subscription.service.SubscriptionService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    public SubscriptionController(
            SubscriptionService subscriptionService
    ) {
        this.subscriptionService = subscriptionService;
    }

    @PostMapping
    public SubscriptionResponse create(
            @RequestBody SubscriptionRequest request,
            Authentication authentication
    ) {
        return subscriptionService.create(request, authentication);
    }

    @GetMapping
    public List<SubscriptionResponse> getMySubscriptions(
            Authentication authentication
    ) {
        return subscriptionService.getMySubscriptions(authentication);
    }

    @PutMapping("/{id}/status")
    public SubscriptionResponse updateStatus(
            @PathVariable Long id,
            @RequestParam SubscriptionStatus status,
            Authentication authentication
    ) {
        return subscriptionService.updateStatus(id, status, authentication);
    }

}