package com.milkdelivery.exception;

public class BusinessDayNotOpenException extends BusinessException {

    public BusinessDayNotOpenException() {
        super("No open business day found.");
    }

}