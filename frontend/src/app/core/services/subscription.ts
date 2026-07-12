import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Subscription } from '../models/subscription.model';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/subscriptions`;

  readonly subscriptions = signal<Subscription[]>([]);

  readonly loading = signal(false);

  loadSubscriptions() {
    this.loading.set(true);

    return this.http.get<Subscription[]>(this.apiUrl).pipe(
      tap((subscriptions) => {
        this.subscriptions.set(subscriptions);

        this.loading.set(false);
      }),
    );
  }

  createSubscription(request: any) {
    return this.http
      .post<Subscription>(this.apiUrl, request)
      .pipe(tap(() => this.loadSubscriptions().subscribe()));
  }

  updateStatus(id: number, status: string) {
    return this.http
      .put<Subscription>(
        `${this.apiUrl}/${id}/status?status=${status}`,

        {},
      )
      .pipe(tap(() => this.loadSubscriptions().subscribe()));
  }
}
