package com.milkdelivery.purchase.dto;

public class PlacePurchaseRequest {
    private Long addressId;
    private String paymentReference;

    public Long getAddressId() { return addressId; }
    public void setAddressId(Long addressId) { this.addressId = addressId; }
    public String getPaymentReference() { return paymentReference; }
    public void setPaymentReference(String paymentReference) { this.paymentReference = paymentReference; }
}
