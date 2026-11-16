package com.milkdelivery.exception;

public class DeliveryPartnerNotFoundException extends BusinessException {

    public DeliveryPartnerNotFoundException(Long id) {
        super("Delivery Partner not found with id: " + id);
    }
}