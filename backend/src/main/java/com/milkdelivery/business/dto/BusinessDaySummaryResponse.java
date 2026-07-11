package com.milkdelivery.business.dto;

import java.time.LocalDate;
import java.util.List;

public class BusinessDaySummaryResponse {

    private LocalDate businessDate;

    private long totalOrders;
    private long deliveredOrders;
    private long pendingOrders;
    private long cancelledOrders;

    private double totalRevenue;

    private long totalCustomers;

    private double openingStock;
    private double reservedStock;
    private double availableStock;

    private List<ProductBusinessSummaryResponse> products;

    public BusinessDaySummaryResponse() {
    }

    public LocalDate getBusinessDate() {
        return businessDate;
    }

    public void setBusinessDate(LocalDate businessDate) {
        this.businessDate = businessDate;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public long getDeliveredOrders() {
        return deliveredOrders;
    }

    public void setDeliveredOrders(long deliveredOrders) {
        this.deliveredOrders = deliveredOrders;
    }

    public long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public long getCancelledOrders() {
        return cancelledOrders;
    }

    public void setCancelledOrders(long cancelledOrders) {
        this.cancelledOrders = cancelledOrders;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public double getOpeningStock() {
        return openingStock;
    }

    public void setOpeningStock(double openingStock) {
        this.openingStock = openingStock;
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

    public List<ProductBusinessSummaryResponse> getProducts() {
        return products;
    }

    public void setProducts(List<ProductBusinessSummaryResponse> products) {
        this.products = products;
    }

}