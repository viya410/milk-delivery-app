package com.milkdelivery.exception;

public class DeliveryPartnerAlreadyExistsException extends BusinessException {

    public DeliveryPartnerAlreadyExistsException(String field, String value) {
        super("Delivery Partner already exists with " + field + ": " + value);
    }
}