package com.milkdelivery.payment.dto;

public class PaymentOrderResponse {

    private String id;

    private Integer amount;

    private String currency;

    public PaymentOrderResponse() {
    }

    public PaymentOrderResponse(
            String id,
            Integer amount,
            String currency
    ) {

        this.id = id;
        this.amount = amount;
        this.currency = currency;

    }

    public String getId() {
        return id;
    }

    public Integer getAmount() {
        return amount;
    }

    public String getCurrency() {
        return currency;
    }

}