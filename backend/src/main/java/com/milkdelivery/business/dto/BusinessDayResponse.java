package com.milkdelivery.business.dto;

import com.milkdelivery.inventory.entity.InventoryDayStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class BusinessDayResponse {

    private LocalDate businessDate;

    private InventoryDayStatus status;

    private LocalDateTime openedAt;

    private LocalDateTime closedAt;

    public BusinessDayResponse() {
    }

    public BusinessDayResponse(
            LocalDate businessDate,
            InventoryDayStatus status,
            LocalDateTime openedAt,
            LocalDateTime closedAt
    ) {
        this.businessDate = businessDate;
        this.status = status;
        this.openedAt = openedAt;
        this.closedAt = closedAt;
    }

    public LocalDate getBusinessDate() {
        return businessDate;
    }

    public void setBusinessDate(LocalDate businessDate) {
        this.businessDate = businessDate;
    }

    public InventoryDayStatus getStatus() {
        return status;
    }

    public void setStatus(InventoryDayStatus status) {
        this.status = status;
    }

    public LocalDateTime getOpenedAt() {
        return openedAt;
    }

    public void setOpenedAt(LocalDateTime openedAt) {
        this.openedAt = openedAt;
    }

    public LocalDateTime getClosedAt() {
        return closedAt;
    }

    public void setClosedAt(LocalDateTime closedAt) {
        this.closedAt = closedAt;
    }
}