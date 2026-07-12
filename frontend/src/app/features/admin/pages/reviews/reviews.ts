import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { ReviewService } from '../../../../core/services/review';

import {
  Review,
} from '../../../../core/models/review.model';

import { ToasterService } from '../../../../core/services/toaster';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './reviews.html',
  styleUrl: './reviews.scss',
})
export class Reviews implements OnInit {

  private readonly reviewService =
    inject(ReviewService);

  private readonly toaster =
    inject(ToasterService);

  readonly reviews = signal<Review[]>([]);

  readonly loading = signal(true);

  readonly processingId =
    signal<number | null>(null);

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {

    this.loading.set(true);

    this.reviewService
      .getAllReviews()
      .subscribe({

        next: (reviews) => {

          this.reviews.set(reviews);

          this.loading.set(false);

        },

        error: (error) => {

          console.error(
            'Failed to load reviews:',
            error
          );

          this.loading.set(false);

          this.toaster.error(
            'Unable to load reviews'
          );

        },

      });
  }

  approveReview(
    review: Review
  ): void {

    this.processingId.set(review.id);

    this.reviewService
      .approveReview(review.id)
      .subscribe({

        next: (updatedReview) => {

          this.reviews.update(
            (reviews) =>
              reviews.map(
                (currentReview) =>
                  currentReview.id ===
                  updatedReview.id
                    ? updatedReview
                    : currentReview
              )
          );

          this.processingId.set(null);

          this.toaster.success(
            'Review approved successfully'
          );

        },

        error: (error) => {

          console.error(
            'Failed to approve review:',
            error
          );

          this.processingId.set(null);

          this.toaster.error(
            'Unable to approve review'
          );

        },

      });
  }

  rejectReview(
    review: Review
  ): void {

    const confirmed = window.confirm(
      `Reject and delete the review from ${review.customerName}?`
    );

    if (!confirmed) {
      return;
    }

    this.processingId.set(review.id);

    this.reviewService
      .deleteReview(review.id)
      .subscribe({

        next: () => {

          this.reviews.update(
            (reviews) =>
              reviews.filter(
                (currentReview) =>
                  currentReview.id !== review.id
              )
          );

          this.processingId.set(null);

          this.toaster.success(
            'Review rejected'
          );

        },

        error: (error) => {

          console.error(
            'Failed to reject review:',
            error
          );

          this.processingId.set(null);

          this.toaster.error(
            'Unable to reject review'
          );

        },

      });
  }
}