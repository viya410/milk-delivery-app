package com.milkdelivery.deliverypartner.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class VerifyOtpRequest {

    @NotBlank(message = "OTP is required.")
    @Pattern(
            regexp = "\\d{6}",
            message = "OTP must be a 6-digit number."
    )
    private String otp;

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }
}