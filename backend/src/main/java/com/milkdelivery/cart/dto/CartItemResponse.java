package com.milkdelivery.cart.dto;

public class CartItemResponse {

    private Long id;

    private Long productId;

    private String productName;

    private Double price;

    private String imageUrl;

    private Integer quantity;

    private String unit;

    private Double maxOrderQuantity;

    private Long productSizeId;

    public CartItemResponse() {
    }

    public CartItemResponse(
            Long id,
            Long productId,
            String productName,
            Double price,
            String imageUrl,
            Integer quantity,
            String unit,
            Double maxOrderQuantity,
            Long productSizeId
    ) {

        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.imageUrl = imageUrl;
        this.quantity = quantity;
        this.unit = unit;
        this.maxOrderQuantity = maxOrderQuantity;
        this.productSizeId = productSizeId;

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

    public String getUnit() {
        return unit;
    }

    public Double getMaxOrderQuantity() {
        return maxOrderQuantity;
    }

    public Long getProductSizeId() {
        return productSizeId;
    }

}