package com.milkdelivery.inventory.repository;

import com.milkdelivery.inventory.entity.InventoryDay;
import com.milkdelivery.inventory.entity.InventoryDayStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface InventoryDayRepository
        extends JpaRepository<InventoryDay, Long> {

    Optional<InventoryDay> findByStatus(
            InventoryDayStatus status
    );

    Optional<InventoryDay> findByBusinessDateAndStatus(
            LocalDate businessDate,
            InventoryDayStatus status
    );

    Optional<InventoryDay> findByBusinessDate(
            LocalDate businessDate
    );

    boolean existsByBusinessDate(
            LocalDate businessDate
    );

}