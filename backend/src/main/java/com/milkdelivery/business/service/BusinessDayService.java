package com.milkdelivery.business.service;

import com.milkdelivery.business.dto.BusinessDayResponse;
import com.milkdelivery.inventory.entity.InventoryDay;
import com.milkdelivery.inventory.repository.InventoryDayRepository;
import com.milkdelivery.inventory.service.InventoryService;
import com.milkdelivery.subscription.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class BusinessDayService {

    private final InventoryService inventoryService;
    private final SubscriptionService subscriptionService;
    private final InventoryDayRepository inventoryDayRepository;

    public void startBusinessDay() {
        inventoryService.openBusinessDay();
    }

    public void generateTodayOrders() {
        subscriptionService.generateTodayOrders();
    }

    public void closeBusinessDay() {
        inventoryService.closeBusinessDay();
    }

    @Transactional(readOnly = true)
    public BusinessDayResponse getTodayBusinessDay() {

        return inventoryDayRepository
                .findByBusinessDate(LocalDate.now())
                .map(this::toResponse)
                .orElse(null);

    }

    private BusinessDayResponse toResponse(InventoryDay businessDay) {

        return new BusinessDayResponse(
                businessDay.getBusinessDate(),
                businessDay.getStatus(),
                businessDay.getOpenedAt(),
                businessDay.getClosedAt()
        );

    }
}