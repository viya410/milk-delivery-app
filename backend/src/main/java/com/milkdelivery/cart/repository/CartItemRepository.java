package com.milkdelivery.cart.repository;

import com.milkdelivery.cart.entity.CartItem;
import com.milkdelivery.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import com.milkdelivery.user.entity.User;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository
        extends JpaRepository<CartItem, Long> {

    Optional<CartItem> findByProduct(
            Product product
    );

    List<CartItem> findByUser(
            User user
    );

    Optional<CartItem> findByProductAndUser(
            Product product,
            User user
    );
}