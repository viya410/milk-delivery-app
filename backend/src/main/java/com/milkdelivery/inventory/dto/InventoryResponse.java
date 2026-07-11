package com.milkdelivery.inventory.dto;

public class InventoryResponse {

    private Long id;

    private Long productId;

    private String productName;

    private Double currentStock;

    private Double reservedStock;

    private Double availableStock;

    public InventoryResponse() {
    }

    public InventoryResponse(
            Long id,
            Long productId,
            String productName,
            Double currentStock,
            Double reservedStock,
            Double availableStock
    ) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.currentStock = currentStock;
        this.reservedStock = reservedStock;
        this.availableStock = availableStock;
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

    public Double getCurrentStock() {
        return currentStock;
    }

    public Double getReservedStock() {
        return reservedStock;
    }

    public Double getAvailableStock() {
        return availableStock;
    }

}