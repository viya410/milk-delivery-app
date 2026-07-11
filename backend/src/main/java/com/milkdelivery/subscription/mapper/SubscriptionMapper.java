package com.milkdelivery.subscription.mapper;

import com.milkdelivery.subscription.dto.SubscriptionResponse;
import com.milkdelivery.subscription.entity.Subscription;
import org.springframework.stereotype.Component;

@Component
public class SubscriptionMapper {

    public SubscriptionResponse toResponse(Subscription subscription) {

        return new SubscriptionResponse(
                subscription.getId(),
                subscription.getProduct().getId(),
                subscription.getProduct().getName(),
                subscription.getQuantity(),
                subscription.getProduct().getUnit(),
                subscription.getFrequency().name(),
                subscription.getStatus().name(),
                subscription.getStartDate(),
                subscription.getEndDate()
        );

    }

}