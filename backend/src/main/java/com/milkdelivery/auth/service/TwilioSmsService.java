package com.milkdelivery.auth.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

@Service
public class TwilioSmsService implements SmsService {
    private final RestClient client;
    @Value("${twilio.account-sid:}") private String accountSid;
    @Value("${twilio.auth-token:}") private String authToken;
    @Value("${twilio.from-number:}") private String fromNumber;
    @Value("${twilio.messaging-service-sid:}") private String messagingServiceSid;

    public TwilioSmsService(RestClient.Builder builder) { this.client = builder.build(); }

    @Override
    public void sendPasswordResetOtp(String phoneNumber, String otp) {
        if (accountSid.isBlank() || authToken.isBlank()
                || (fromNumber.isBlank() && messagingServiceSid.isBlank())) {
            throw new IllegalStateException("SMS provider is not configured.");
        }
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("To", phoneNumber.startsWith("+") ? phoneNumber : "+91" + phoneNumber);
        body.add("Body", "Your RK Farms password reset OTP is " + otp
                + ". It expires in 5 minutes. Do not share it.");
        if (!messagingServiceSid.isBlank()) body.add("MessagingServiceSid", messagingServiceSid);
        else body.add("From", fromNumber);

        client.post()
                .uri("https://api.twilio.com/2010-04-01/Accounts/{sid}/Messages.json", accountSid)
                .headers(headers -> headers.setBasicAuth(accountSid, authToken))
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(body)
                .retrieve()
                .toBodilessEntity();
    }
}
