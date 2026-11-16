package com.milkdelivery.purchase.repository;

import com.milkdelivery.purchase.entity.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    Optional<Purchase> findByPaymentReference(String paymentReference);
    List<Purchase> findByUser_IdOrderByCreatedAtDesc(Long userId);
}
