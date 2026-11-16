package com.milkdelivery.deliverypartner.dto.response;

import com.milkdelivery.deliverypartner.entity.DeliveryPartnerStatus;

public class DeliveryPartnerDashboardResponse {

    private DeliveryPartnerStatus status;
    private long availableOrders;
    private long assignedOrders;
    private long completedToday;

    public DeliveryPartnerStatus getStatus() {
        return status;
    }

    public void setStatus(DeliveryPartnerStatus status) {
        this.status = status;
    }

    public long getAvailableOrders() {
        return availableOrders;
    }

    public void setAvailableOrders(long availableOrders) {
        this.availableOrders = availableOrders;
    }

    public long getAssignedOrders() {
        return assignedOrders;
    }

    public void setAssignedOrders(long assignedOrders) {
        this.assignedOrders = assignedOrders;
    }

    public long getCompletedToday() {
        return completedToday;
    }

    public void setCompletedToday(long completedToday) {
        this.completedToday = completedToday;
    }
}