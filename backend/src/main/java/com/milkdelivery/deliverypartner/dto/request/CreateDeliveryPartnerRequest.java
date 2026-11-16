package com.milkdelivery.deliverypartner.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class CreateDeliveryPartnerRequest {

    @NotBlank(message = "Full name is required.")
    private String fullName;

    @Email(message = "Invalid email address.")
    private String email;

    @NotBlank(message = "Phone number is required.")
    @Pattern(
            regexp = "^[6-9]\\d{9}$",
            message = "Phone number must be a valid 10-digit Indian mobile number."
    )
    private String phoneNumber;

    @NotBlank(message = "Password is required.")
    @Size(
            min = 6,
            message = "Password must contain at least 6 characters."
    )
    private String password;

    @NotBlank(message = "Employee code is required.")
    private String employeeCode;

    @NotNull(message = "Route is required.")
    private Long routeId;

    public CreateDeliveryPartnerRequest() {
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

    public String getPassword() {
        return password;
    }

    public void setPassword(
            String password
    ) {
        this.password = password;
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

}