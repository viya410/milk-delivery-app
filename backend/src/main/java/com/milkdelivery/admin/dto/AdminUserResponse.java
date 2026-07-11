package com.milkdelivery.admin.dto;

import com.milkdelivery.user.entity.Role;

public class AdminUserResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private Role role;
    private long totalOrders;
    private long totalAddresses;
    private long activeSubscriptions;
    private long pausedSubscriptions;

    public AdminUserResponse() {
    }

    public AdminUserResponse(
            Long id,
            String fullName,
            String email,
            String phoneNumber,
            Role role,
            long totalOrders,
            long totalAddresses,
            long activeSubscriptions,
            long pausedSubscriptions
    ) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.totalOrders = totalOrders;
        this.totalAddresses = totalAddresses;
        this.activeSubscriptions = activeSubscriptions;
        this.pausedSubscriptions = pausedSubscriptions;
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public Role getRole() {
        return role;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public long getTotalAddresses() {
        return totalAddresses;
    }

    public long getActiveSubscriptions() {
        return activeSubscriptions;
    }

    public long getPausedSubscriptions() {
        return pausedSubscriptions;
    }
}