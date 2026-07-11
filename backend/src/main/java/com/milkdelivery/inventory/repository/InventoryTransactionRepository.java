package com.milkdelivery.inventory.repository;

import com.milkdelivery.inventory.entity.InventoryTransaction;
import com.milkdelivery.inventory.entity.TransactionType;
import com.milkdelivery.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface InventoryTransactionRepository
        extends JpaRepository<InventoryTransaction, Long> {

    List<InventoryTransaction> findByProductOrderByTransactionDateDesc(
            Product product
    );

    List<InventoryTransaction> findByBusinessDate(
            LocalDate businessDate
    );

    List<InventoryTransaction> findByBusinessDateAndType(
            LocalDate businessDate,
            TransactionType type
    );
}