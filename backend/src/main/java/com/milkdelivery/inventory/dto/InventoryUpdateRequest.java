package com.milkdelivery.inventory.dto;

import com.milkdelivery.inventory.entity.TransactionType;

public class InventoryUpdateRequest {

    private TransactionType operation;

    private Double quantity;

    private String remarks;

    public InventoryUpdateRequest() {
    }

    public TransactionType getOperation() {
        return operation;
    }

    public void setOperation(TransactionType operation) {
        this.operation = operation;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

}