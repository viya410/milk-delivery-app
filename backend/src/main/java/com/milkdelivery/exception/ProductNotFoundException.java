package com.milkdelivery.exception;

public class ProductNotFoundException extends BusinessException {

    public ProductNotFoundException(Long id) {
        super("Product not found with id: " + id);
    }

}