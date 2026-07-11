package com.milkdelivery.inventory.dto;

public class DailyStatistics {

    private Double openingStock;

    private Double closingStock;

    private Double totalCollected;

    private Double totalSold;

    private Double totalWaste;

    private Double totalRevenue;

    private Integer totalOrders;

    private Integer totalSubscriptions;

    public DailyStatistics() {
    }

    public Double getOpeningStock() {
        return openingStock;
    }

    public void setOpeningStock(Double openingStock) {
        this.openingStock = openingStock;
    }

    public Double getClosingStock() {
        return closingStock;
    }

    public void setClosingStock(Double closingStock) {
        this.closingStock = closingStock;
    }

    public Double getTotalCollected() {
        return totalCollected;
    }

    public void setTotalCollected(Double totalCollected) {
        this.totalCollected = totalCollected;
    }

    public Double getTotalSold() {
        return totalSold;
    }

    public void setTotalSold(Double totalSold) {
        this.totalSold = totalSold;
    }

    public Double getTotalWaste() {
        return totalWaste;
    }

    public void setTotalWaste(Double totalWaste) {
        this.totalWaste = totalWaste;
    }

    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(Double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public Integer getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Integer totalOrders) {
        this.totalOrders = totalOrders;
    }

    public Integer getTotalSubscriptions() {
        return totalSubscriptions;
    }

    public void setTotalSubscriptions(Integer totalSubscriptions) {
        this.totalSubscriptions = totalSubscriptions;
    }

}