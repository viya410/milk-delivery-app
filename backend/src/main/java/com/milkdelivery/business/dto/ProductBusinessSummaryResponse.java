package com.milkdelivery.business.dto;

public class ProductBusinessSummaryResponse {

    private Long productId;
    private String productName;

    private double currentStock;
    private double reservedStock;
    private double availableStock;

    private double stockAdded;
    private double stockRemoved;
    private double quantitySold;

    private double revenue;

    public ProductBusinessSummaryResponse() {
    }

    public ProductBusinessSummaryResponse(
            Long productId,
            String productName,
            double currentStock,
            double reservedStock,
            double availableStock,
            double stockAdded,
            double stockRemoved,
            double quantitySold,
            double revenue
    ) {
        this.productId = productId;
        this.productName = productName;
        this.currentStock = currentStock;
        this.reservedStock = reservedStock;
        this.availableStock = availableStock;
        this.stockAdded = stockAdded;
        this.stockRemoved = stockRemoved;
        this.quantitySold = quantitySold;
        this.revenue = revenue;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public double getCurrentStock() {
        return currentStock;
    }

    public void setCurrentStock(double currentStock) {
        this.currentStock = currentStock;
    }

    public double getReservedStock() {
        return reservedStock;
    }

    public void setReservedStock(double reservedStock) {
        this.reservedStock = reservedStock;
    }

    public double getAvailableStock() {
        return availableStock;
    }

    public void setAvailableStock(double availableStock) {
        this.availableStock = availableStock;
    }

    public double getStockAdded() {
        return stockAdded;
    }

    public void setStockAdded(double stockAdded) {
        this.stockAdded = stockAdded;
    }

    public double getStockRemoved() {
        return stockRemoved;
    }

    public void setStockRemoved(double stockRemoved) {
        this.stockRemoved = stockRemoved;
    }

    public double getQuantitySold() {
        return quantitySold;
    }

    public void setQuantitySold(double quantitySold) {
        this.quantitySold = quantitySold;
    }

    public double getRevenue() {
        return revenue;
    }

    public void setRevenue(double revenue) {
        this.revenue = revenue;
    }
}