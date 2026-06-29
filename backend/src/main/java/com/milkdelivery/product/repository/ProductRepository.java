package com.milkdelivery.product.repository;

import com.milkdelivery.product.entity.Product;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository
        extends JpaRepository<Product, Long> {
}