import {
  Component,
  inject,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReviewService } from '../../../../core/services/review';
import { ToasterService } from '../../../../core/services/toaster';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './review-form.html',
  styleUrl: './review-form.scss',
})
export class ReviewForm {
  private readonly reviewService =
    inject(ReviewService);

  private readonly toaster =
    inject(ToasterService);

  readonly rating = signal(0);

  readonly hoverRating = signal(0);

  readonly submitting = signal(false);

  comment = '';

  setRating(
    value: number
  ): void {
    this.rating.set(value);
  }

  setHoverRating(
    value: number
  ): void {
    this.hoverRating.set(value);
  }

  clearHover(): void {
    this.hoverRating.set(0);
  }

  isStarActive(
    star: number
  ): boolean {
    const activeRating =
      this.hoverRating() || this.rating();

    return star <= activeRating;
  }

  submitReview(): void {

    if (this.rating() === 0) {
      this.toaster.warning(
        'Please select a rating'
      );

      return;
    }

    const trimmedComment =
      this.comment.trim();

    if (!trimmedComment) {
      this.toaster.warning(
        'Please write your review'
      );

      return;
    }

    this.submitting.set(true);

    this.reviewService
      .submitReview({
        rating: this.rating(),
        comment: trimmedComment,
      })
      .subscribe({
        next: () => {
          this.toaster.success(
            'Thank you! Your review was submitted.'
          );

          this.rating.set(0);

          this.hoverRating.set(0);

          this.comment = '';

          this.submitting.set(false);
        },

        error: (error) => {
          console.error(
            'Failed to submit review:',
            error
          );

          this.submitting.set(false);

          if (error.status === 401) {
            this.toaster.warning(
              'Please login to submit a review'
            );

            return;
          }

          if (error.status === 403) {
            this.toaster.warning(
              'You are not allowed to submit a review'
            );

            return;
          }

          this.toaster.error(
            error.error?.message ||
            'Unable to submit review'
          );
        },
      });
  }
}