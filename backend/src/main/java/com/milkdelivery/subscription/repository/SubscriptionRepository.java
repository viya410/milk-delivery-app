package com.milkdelivery.subscription.repository;

import com.milkdelivery.subscription.entity.Subscription;
import com.milkdelivery.subscription.entity.SubscriptionStatus;
import com.milkdelivery.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    List<Subscription> findByUser(User user);
    List<Subscription> findByStatus(SubscriptionStatus status);
    
    long countByUserAndStatus(User user, SubscriptionStatus status);
}