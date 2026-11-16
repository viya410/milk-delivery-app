package com.milkdelivery.payment.dto;

public class PaymentRequest {

    private String razorpayPaymentId;

    private String razorpayOrderId;

    private Double amount;

    private String razorpaySignature;

    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(
            String razorpayPaymentId
    ) {
        this.razorpayPaymentId = razorpayPaymentId;
    }

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(
            String razorpayOrderId
    ) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public String getRazorpaySignature() { return razorpaySignature; }

    public void setRazorpaySignature(String razorpaySignature) { this.razorpaySignature = razorpaySignature; }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(
            Double amount
    ) {
        this.amount = amount;
    }

}