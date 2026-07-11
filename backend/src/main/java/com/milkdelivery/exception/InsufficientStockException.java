package com.milkdelivery.exception;

public class InsufficientStockException extends BusinessException {

    public InsufficientStockException() {
        super("Insufficient stock available.");
    }

}