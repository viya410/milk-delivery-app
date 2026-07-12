package com.milkdelivery.review.repository;

import com.milkdelivery.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByApprovedTrueOrderByCreatedAtDesc();

    boolean existsByUserId(Long userId);
}