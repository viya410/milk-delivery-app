import { Injectable, inject, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/orders`;
  private purchasesUrl = `${environment.apiUrl}/purchases`;

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

  placePurchase(addressId: number, paymentReference?: string) {
    return this.http.post<any>(this.purchasesUrl, {
      addressId,
      paymentReference: paymentReference || null
    });
  }

  getPurchases() {
    return this.http.get<any[]>(this.purchasesUrl);
  }

  getPurchases() {
    return this.http.get<any[]>(this.purchasesUrl);
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
