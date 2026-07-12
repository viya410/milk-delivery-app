package com.milkdelivery.review.controller;

import com.milkdelivery.review.dto.ReviewRequest;
import com.milkdelivery.review.dto.ReviewResponse;
import com.milkdelivery.review.entity.Review;
import com.milkdelivery.review.service.ReviewService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;


    public ReviewController(
            ReviewService reviewService
    ) {

        this.reviewService =
                reviewService;

    }


    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(

            @RequestBody ReviewRequest request,

            Authentication authentication

    ) {

        Review review =
                reviewService.createReview(

                        authentication.getName(),

                        request.getRating(),

                        request.getComment()

                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ReviewResponse.from(review)
                );

    }


    @GetMapping("/approved")
    public List<ReviewResponse> getApprovedReviews() {

        return reviewService
                .getApprovedReviews()
                .stream()
                .map(
                        ReviewResponse::from
                )
                .toList();

    }
}