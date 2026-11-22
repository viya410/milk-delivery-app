package com.milkdelivery.auth.service;

public interface SmsService {
    void sendPasswordResetOtp(String phoneNumber, String otp);
}
