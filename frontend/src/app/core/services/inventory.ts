import { Injectable, inject, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { tap } from 'rxjs';

import { Inventory } from '../models/inventory.model';
import { InventoryTransaction } from '../models/inventory-transaction.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/admin/inventory';

  readonly inventory = signal<Inventory[]>([]);

  readonly loading = signal(false);
  readonly transactions = signal<InventoryTransaction[]>([]);
  

  loadInventory() {
    this.loading.set(true);

    return this.http

      .get<Inventory[]>(this.apiUrl)

      .pipe(
        tap((response) => {
          this.inventory.set(response);

          this.loading.set(false);
        }),
      );
  }

  addStock(
    productId: number,

    quantity: number,

    remarks: string,
  ) {
    return this.http
      .put(
        `${this.apiUrl}/${productId}/add`,

        {
          quantity,

          remarks,
        },
      )
      .pipe(tap(() => this.loadInventory().subscribe()));
  }

  removeStock(
    productId: number,

    quantity: number,

    remarks: string,
  ) {
    return this.http
      .put(
        `${this.apiUrl}/${productId}/remove`,

        {
          quantity,

          remarks,
        },
      )
      .pipe(tap(() => this.loadInventory().subscribe()));
  }

  adjustStock(
    productId: number,

    quantity: number,

    remarks: string,
  ) {
    return this.http
      .put(
        `${this.apiUrl}/${productId}/adjust`,

        {
          quantity,

          remarks,
        },
      )
      .pipe(tap(() => this.loadInventory().subscribe()));
  }

  openBusinessDay() {
    return this.http.post(
      `${this.apiUrl}/open-day`,

      {},
    );
  }

  closeBusinessDay() {
    return this.http.post(
      `${this.apiUrl}/close-day`,

      {},
    );
  }

  loadTransactions() {

  return this.http

    .get<InventoryTransaction[]>(

      `${this.apiUrl}/transactions`

    )

    .pipe(

      tap(response =>

        this.transactions.set(response)

      )

    );

}
}
