package com.milkdelivery.dashboard.dto;

public class DashboardSummaryResponse {

    private long totalOrders;

    private long activePlans;

    private long totalAddresses;

    public DashboardSummaryResponse() {
    }

    public DashboardSummaryResponse(
            long totalOrders,
            long activePlans,
            long totalAddresses
    ) {

        this.totalOrders = totalOrders;
        this.activePlans = activePlans;
        this.totalAddresses = totalAddresses;

    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public long getActivePlans() {
        return activePlans;
    }

    public long getTotalAddresses() {
        return totalAddresses;
    }

}