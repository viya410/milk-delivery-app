package com.milkdelivery.exception;

public class RouteNotFoundException extends BusinessException {

    public RouteNotFoundException(Long id) {
        super("Route not found with id: " + id);
    }
}