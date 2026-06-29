package com.milkdelivery.order.repository;

import com.milkdelivery.order.entity.Order;
import com.milkdelivery.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository
        extends JpaRepository<Order, Long> {

    List<Order> findByUser(User user);

    List<Order> findByUserOrderByOrderDateDesc(User user);

    long countByUser(User user);

}