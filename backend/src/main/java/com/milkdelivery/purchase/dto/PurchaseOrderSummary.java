package com.milkdelivery.purchase.dto;

public class PurchaseOrderSummary {
    private Long orderId;
    private String category;
    private Double totalAmount;
    private String status;

    public PurchaseOrderSummary(Long orderId, String category, Double totalAmount, String status) {
        this.orderId = orderId;
        this.category = category;
        this.totalAmount = totalAmount;
        this.status = status;
    }
    public Long getOrderId() { return orderId; }
    public String getCategory() { return category; }
    public Double getTotalAmount() { return totalAmount; }
    public String getStatus() { return status; }
}
