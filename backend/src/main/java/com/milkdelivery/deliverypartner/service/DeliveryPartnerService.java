package com.milkdelivery.deliverypartner.service;

import com.milkdelivery.deliverypartner.dto.request.CreateDeliveryPartnerRequest;
import com.milkdelivery.deliverypartner.dto.request.DeliveryPartnerRegisterRequest;
import com.milkdelivery.deliverypartner.dto.request.VerifyOtpRequest;
import com.milkdelivery.deliverypartner.dto.response.DeliveryPartnerDashboardResponse;
import com.milkdelivery.deliverypartner.dto.response.DeliveryPartnerResponse;
import com.milkdelivery.order.dto.OrderResponse;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface DeliveryPartnerService {

    /**
     * Admin API
     */
    DeliveryPartnerResponse createDeliveryPartner(
            CreateDeliveryPartnerRequest request
    );

    /**
     * Public Signup API
     */
    void registerDeliveryPartner(
            DeliveryPartnerRegisterRequest request
    );

    /**
     * Orders available to pick.
     */
    List<OrderResponse> getAvailableOrders(
            Authentication authentication
    );

    /**
     * Orders assigned to the logged-in partner.
     */
    List<OrderResponse> getMyOrders(
            Authentication authentication
    );

    /**
     * Pick an available order.
     */
    OrderResponse pickOrder(
            Long orderId,
            Authentication authentication
    );

    OrderResponse verifyOtp(
            Long orderId,
            VerifyOtpRequest request,
            Authentication authentication
    );

    DeliveryPartnerDashboardResponse getDashboard(
            Authentication authentication
    );

    DeliveryPartnerResponse getProfile(Authentication authentication);
}