package com.milkdelivery.cart.dto;

public class CartItemResponse {

    private Long id;

    private Long productId;

    private String productName;

    private Double price;

    private String imageUrl;

    private Integer quantity;

    public CartItemResponse() {
    }

    public CartItemResponse(
            Long id,
            Long productId,
            String productName,
            Double price,
            String imageUrl,
            Integer quantity
    ) {

        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.imageUrl = imageUrl;
        this.quantity = quantity;

    }

    public Long getId() {
        return id;
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

    public String getImageUrl() {
        return imageUrl;
    }

    public Integer getQuantity() {
        return quantity;
    }

}