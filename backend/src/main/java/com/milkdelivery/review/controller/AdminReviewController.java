package com.milkdelivery.review.controller;

import com.milkdelivery.review.dto.ReviewResponse;
import com.milkdelivery.review.entity.Review;
import com.milkdelivery.review.service.ReviewService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reviews")
public class AdminReviewController {

    private final ReviewService reviewService;


    public AdminReviewController(
            ReviewService reviewService
    ) {

        this.reviewService =
                reviewService;

    }


    @GetMapping
    public List<ReviewResponse> getAllReviews() {

        return reviewService
                .getAllReviews()
                .stream()
                .map(
                        ReviewResponse::from
                )
                .toList();

    }


    @PutMapping("/{id}/approve")
    public ReviewResponse approveReview(
            @PathVariable Long id
    ) {

        Review review =
                reviewService
                        .approveReview(id);

        return ReviewResponse.from(
                review
        );

    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long id
    ) {

        reviewService
                .deleteReview(id);

        return ResponseEntity
                .noContent()
                .build();

    }
}