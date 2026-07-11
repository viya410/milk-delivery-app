package com.milkdelivery.product.repository;

import com.milkdelivery.product.entity.Product;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository
        extends JpaRepository<Product, Long> {

    List<Product> findByAvailableFalse();

    @EntityGraph(attributePaths = "sizes")
    List<Product> findAll();

    @EntityGraph(attributePaths = "sizes")
    Optional<Product> findById(Long id);
}