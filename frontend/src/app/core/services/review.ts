import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  Review,
  ReviewRequest,
} from '../models/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {

  private readonly http = inject(HttpClient);

  private readonly reviewsUrl =
    `${environment.apiUrl}/reviews`;

  private readonly adminReviewsUrl =
    `${environment.apiUrl}/admin/reviews`;

  /*
   * PUBLIC
   * Get approved reviews
   */
  getApprovedReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(
      `${this.reviewsUrl}/approved`
    );
  }

  /*
   * CUSTOMER
   * Submit review
   */
  submitReview(
    request: ReviewRequest
  ): Observable<Review> {

    return this.http.post<Review>(
      this.reviewsUrl,
      request
    );
  }

  /*
   * ADMIN
   * Get all reviews
   */
  getAllReviews(): Observable<Review[]> {

    return this.http.get<Review[]>(
      this.adminReviewsUrl
    );
  }

  /*
   * ADMIN
   * Approve review
   */
  approveReview(
    reviewId: number
  ): Observable<Review> {

    return this.http.put<Review>(
      `${this.adminReviewsUrl}/${reviewId}/approve`,
      {}
    );
  }

  /*
   * ADMIN
   * Reject / delete review
   */
  deleteReview(
    reviewId: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.adminReviewsUrl}/${reviewId}`
    );
  }
}