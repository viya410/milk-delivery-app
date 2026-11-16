package com.milkdelivery.purchase.dto;

import java.time.LocalDateTime;
import java.util.List;

public class PurchaseResponse {
    private Long purchaseId;
    private Double grandTotal;
    private LocalDateTime createdAt;
    private String paymentReference;
    private List<PurchaseOrderSummary> orders;

    public PurchaseResponse(Long purchaseId, Double grandTotal, LocalDateTime createdAt,
                            String paymentReference, List<PurchaseOrderSummary> orders) {
        this.purchaseId = purchaseId;
        this.grandTotal = grandTotal;
        this.createdAt = createdAt;
        this.paymentReference = paymentReference;
        this.orders = orders;
    }
    public Long getPurchaseId() { return purchaseId; }
    public Double getGrandTotal() { return grandTotal; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getPaymentReference() { return paymentReference; }
    public List<PurchaseOrderSummary> getOrders() { return orders; }
}
