package com.milkdelivery.order.repository;

import com.milkdelivery.order.entity.Order;
import com.milkdelivery.subscription.entity.Subscription;
import com.milkdelivery.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository
        extends JpaRepository<Order, Long> {

    List<Order> findByUser(User user);
    Optional<Order> findById(Long id);

    List<Order> findByUserOrderByOrderDateDesc(User user);

    long countByUser(User user);

    long countByStatus(
            String status
    );

    List<Order> findTop5ByOrderByOrderDateDesc();

    boolean existsBySubscriptionAndOrderDateBetween(
            Subscription subscription,
            LocalDateTime start,
            LocalDateTime end
    );

    List<Order> findByOrderDateBetweenOrderByOrderDateAsc(
            LocalDateTime start,
            LocalDateTime end
    );

    long countByOrderDateBetween(
            LocalDateTime start,
            LocalDateTime end
    );

    boolean existsByOrderDateBetween(
            LocalDateTime start,
            LocalDateTime end
    );
}