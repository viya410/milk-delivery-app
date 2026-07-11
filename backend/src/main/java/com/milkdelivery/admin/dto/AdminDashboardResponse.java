package com.milkdelivery.admin.dto;

import com.milkdelivery.order.dto.OrderResponse;
import com.milkdelivery.product.entity.Product;

import java.util.List;

public class AdminDashboardResponse {

    private long totalUsers;

    private long totalProducts;

    private long totalOrders;

    private long pendingOrders;

    private long completedOrders;

    private double totalRevenue;

    private List<OrderResponse> recentOrders;

    private List<Product> unavailableProducts;

    public AdminDashboardResponse() {
    }

    public AdminDashboardResponse(

            long totalUsers,

            long totalProducts,

            long totalOrders,

            long pendingOrders,

            long completedOrders,

            double totalRevenue,

            List<OrderResponse> recentOrders,

            List<Product> unavailableProducts

    ) {

        this.totalUsers = totalUsers;

        this.totalProducts = totalProducts;

        this.totalOrders = totalOrders;

        this.pendingOrders = pendingOrders;

        this.completedOrders = completedOrders;

        this.totalRevenue = totalRevenue;

        this.recentOrders = recentOrders;

        this.unavailableProducts = unavailableProducts;

    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public long getCompletedOrders() {
        return completedOrders;
    }

    public void setCompletedOrders(long completedOrders) {
        this.completedOrders = completedOrders;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public List<OrderResponse> getRecentOrders() {
        return recentOrders;
    }

    public void setRecentOrders(List<OrderResponse> recentOrders) {
        this.recentOrders = recentOrders;
    }

    public List<Product> getUnavailableProducts() {
        return unavailableProducts;
    }

    public void setUnavailableProducts(List<Product> unavailableProducts) {
        this.unavailableProducts = unavailableProducts;
    }

}