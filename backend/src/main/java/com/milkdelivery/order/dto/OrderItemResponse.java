package com.milkdelivery.order.dto;

public class OrderItemResponse {

    private Long productId;
    private String productName;
    private Double price;
    private String unit;
    private Integer quantity;

    public OrderItemResponse() {
    }

    public OrderItemResponse(
            Long productId,
            String productName,
            Double price,
            String unit,
            Integer quantity
    ) {
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.unit = unit;
        this.quantity = quantity;
    }

    public Long getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public Double getPrice() {
        return price;
    }

    public String getUnit() {
        return unit;
    }

    public Integer getQuantity() {
        return quantity;
    }
}