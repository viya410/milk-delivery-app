package com.milkdelivery.exception;

public class RouteAlreadyExistsException extends BusinessException {

    public RouteAlreadyExistsException(
            String field,
            String value
    ) {
        super("Route already exists with " + field + ": " + value);
    }

}