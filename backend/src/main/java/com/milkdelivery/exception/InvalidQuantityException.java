package com.milkdelivery.exception;

public class InvalidQuantityException extends BusinessException {

    public InvalidQuantityException() {
        super("Quantity must be greater than zero.");
    }

}