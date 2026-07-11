package com.milkdelivery.subscription.dto;

import java.time.LocalDate;

public class SubscriptionResponse {

    private Long id;
    private Long productId;
    private String productName;
    private Double quantity;
    private String unit;
    private String frequency;
    private String status;
    private LocalDate startDate;
    private LocalDate endDate;

    public SubscriptionResponse(
            Long id,
            Long productId,
            String productName,
            Double quantity,
            String unit,
            String frequency,
            String status,
            LocalDate startDate,
            LocalDate endDate
    ) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.unit = unit;
        this.frequency = frequency;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public Long getId() {
        return id;
    }

    public Long getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public Double getQuantity() {
        return quantity;
    }

    public String getUnit() {
        return unit;
    }

    public String getFrequency() {
        return frequency;
    }

    public String getStatus() {
        return status;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

}