package com.milkdelivery.inventory.repository;

import com.milkdelivery.inventory.entity.Inventory;
import com.milkdelivery.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    Optional<Inventory> findByProduct(Product product);

    Optional<Inventory> findByProductId(Long productId);

    boolean existsByProduct(Product product);

}