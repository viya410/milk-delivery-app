package com.milkdelivery.deliverypartner.dto.response;

import com.milkdelivery.deliverypartner.entity.DeliveryPartnerStatus;

public class DeliveryPartnerResponse {

    private Long id;

    private String fullName;

    private String email;

    private String phoneNumber;

    private String employeeCode;

    private Long routeId;

    private String routeName;

    private DeliveryPartnerStatus status;

    public DeliveryPartnerResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(
            Long id
    ) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(
            String fullName
    ) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(
            String email
    ) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(
            String phoneNumber
    ) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(
            String employeeCode
    ) {
        this.employeeCode = employeeCode;
    }

    public Long getRouteId() {
        return routeId;
    }

    public void setRouteId(
            Long routeId
    ) {
        this.routeId = routeId;
    }

    public String getRouteName() {
        return routeName;
    }

    public void setRouteName(
            String routeName
    ) {
        this.routeName = routeName;
    }

    public DeliveryPartnerStatus getStatus() {
        return status;
    }

    public void setStatus(
            DeliveryPartnerStatus status
    ) {
        this.status = status;
    }

}