package com.milkdelivery.inventory.dto;

import com.milkdelivery.inventory.entity.TransactionType;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class InventoryTransactionResponse {

    private Long id;
    private Long productId;
    private String productName;
    private TransactionType type;
    private Double quantity;
    private String remarks;
    private String reference;
    private LocalDate businessDate;
    private LocalDateTime transactionDate;

    public InventoryTransactionResponse(
            Long id,
            Long productId,
            String productName,
            TransactionType type,
            Double quantity,
            String remarks,
            String reference,
            LocalDate businessDate,
            LocalDateTime transactionDate
    ) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.type = type;
        this.quantity = quantity;
        this.remarks = remarks;
        this.reference = reference;
        this.businessDate = businessDate;
        this.transactionDate = transactionDate;
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

    public TransactionType getType() {
        return type;
    }

    public Double getQuantity() {
        return quantity;
    }

    public String getRemarks() {
        return remarks;
    }

    public String getReference() {
        return reference;
    }

    public LocalDate getBusinessDate() {
        return businessDate;
    }

    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }
}