package com.milkdelivery.cart.repository;

import com.milkdelivery.cart.entity.CartItem;
import com.milkdelivery.product.entity.Product;
import com.milkdelivery.product.entity.ProductSize;
import com.milkdelivery.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

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

    Optional<CartItem> findByProductAndUserAndProductSize(
            Product product,
            User user,
            ProductSize productSize
    );

}