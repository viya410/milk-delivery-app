package com.milkdelivery.exception;

public class InventoryNotFoundException extends BusinessException {

    public InventoryNotFoundException(Long productId) {
        super("Inventory not found for product id: " + productId);
    }

}