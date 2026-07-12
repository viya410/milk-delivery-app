package com.milkdelivery.review.dto;

import com.milkdelivery.review.entity.Review;

import java.time.LocalDateTime;

public class ReviewResponse {

    private Long id;

    private String customerName;

    private Integer rating;

    private String comment;

    private boolean approved;

    private LocalDateTime createdAt;


    public ReviewResponse() {
    }


    public static ReviewResponse from(
            Review review
    ) {

        ReviewResponse response =
                new ReviewResponse();

        response.setId(
                review.getId()
        );

        response.setCustomerName(
                review.getCustomerName()
        );

        response.setRating(
                review.getRating()
        );

        response.setComment(
                review.getComment()
        );

        response.setApproved(
                review.isApproved()
        );

        response.setCreatedAt(
                review.getCreatedAt()
        );

        return response;
    }


    public Long getId() {
        return id;
    }

    public void setId(
            Long id
    ) {
        this.id = id;
    }


    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(
            String customerName
    ) {
        this.customerName = customerName;
    }


    public Integer getRating() {
        return rating;
    }

    public void setRating(
            Integer rating
    ) {
        this.rating = rating;
    }


    public String getComment() {
        return comment;
    }

    public void setComment(
            String comment
    ) {
        this.comment = comment;
    }


    public boolean isApproved() {
        return approved;
    }

    public void setApproved(
            boolean approved
    ) {
        this.approved = approved;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt
    ) {
        this.createdAt = createdAt;
    }
}