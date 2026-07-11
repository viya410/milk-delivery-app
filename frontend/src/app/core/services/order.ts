import { Injectable, inject, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/orders';

  readonly orders = signal<any[]>([]);

  readonly loading = signal(false);

  placeOrder(addressId: number) {
    return this.http.post(
      this.apiUrl,

      {
        addressId,
      },
    );
  }

  getOrders() {
    this.loading.set(true);

    return this.http.get<any[]>(this.apiUrl).pipe(
      tap((response) => {
        this.orders.set(response);

        this.loading.set(false);
      }),
    );
  }

  refreshOrders(): void {
    this.getOrders().subscribe();
  }

  cancelOrder(orderId: number) {
    return this.http.put<any>(`${this.apiUrl}/${orderId}/cancel`, {});
  }
}
