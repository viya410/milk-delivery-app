package com.milkdelivery.review.service;

import com.milkdelivery.review.entity.Review;
import com.milkdelivery.review.repository.ReviewRepository;
import com.milkdelivery.user.entity.User;
import com.milkdelivery.user.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    private final UserRepository userRepository;

    public ReviewService(
            ReviewRepository reviewRepository,
            UserRepository userRepository
    ) {

        this.reviewRepository = reviewRepository;

        this.userRepository = userRepository;

    }

    public Review createReview(
            String email,
            Integer rating,
            String comment
    ) {

        if (rating == null || rating < 1 || rating > 5) {

            throw new IllegalArgumentException(
                    "Rating must be between 1 and 5"
            );

        }

        if (
                comment == null ||
                        comment.trim().isEmpty()
        ) {

            throw new IllegalArgumentException(
                    "Review comment is required"
            );

        }

        User user = userRepository
                .findByEmail(email)
                .or(() ->
                        userRepository.findByPhoneNumber(email)
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );

        if (
                reviewRepository
                        .existsByUserId(user.getId())
        ) {

            throw new IllegalStateException(
                    "You have already submitted a review"
            );

        }

        Review review = new Review();

        review.setUser(user);

        review.setCustomerName(
                user.getFullName()
        );

        review.setRating(
                rating
        );

        review.setComment(
                comment.trim()
        );

        review.setApproved(
                false
        );

        return reviewRepository.save(
                review
        );

    }

    public List<Review> getApprovedReviews() {

        return reviewRepository
                .findByApprovedTrueOrderByCreatedAtDesc();

    }

    public List<Review> getAllReviews() {

        return reviewRepository.findAll();

    }

    public Review approveReview(
            Long id
    ) {

        Review review = reviewRepository
                .findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Review not found"
                        )
                );

        review.setApproved(
                true
        );

        return reviewRepository.save(
                review
        );

    }

    public void deleteReview(
            Long id
    ) {

        if (
                !reviewRepository.existsById(id)
        ) {

            throw new IllegalArgumentException(
                    "Review not found"
            );

        }

        reviewRepository.deleteById(
                id
        );

    }
}