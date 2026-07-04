import { Injectable, inject, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { AdminOrder } from '../models/admin-order.model';

@Injectable({
  providedIn: 'root'
})
export class AdminOrderService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/admin/orders`;

  readonly orders = signal<AdminOrder[]>([]);

  readonly loading = signal(false);

  loadOrders() {

    this.loading.set(true);

    return this.http
      .get<AdminOrder[]>(this.apiUrl)
      .pipe(
        tap(orders => {
            console.log(orders);
          this.orders.set(orders);
          this.loading.set(false);

        })
      );

  }

  updateStatus(
    id: number,
    status: string
  ) {

    return this.http
      .put<AdminOrder>(
        `${this.apiUrl}/${id}/status?status=${status}`,
        {}
      )
      .pipe(
        tap(() => {

          this.loadOrders().subscribe();

        })
      );

  }

}