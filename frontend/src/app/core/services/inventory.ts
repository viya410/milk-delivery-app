import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

import { environment } from '../../../environments/environment';

import { Inventory } from '../models/inventory.model';
import { InventoryTransaction } from '../models/inventory-transaction.model';
import { BusinessDay } from '../models/business-day.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/admin/inventory`;

  private readonly businessDayApi = `${environment.apiUrl}/admin/business-day`;

  readonly inventory = signal<Inventory[]>([]);

  readonly transactions = signal<InventoryTransaction[]>([]);

  readonly businessDay = signal<BusinessDay | null>(null);

  readonly loading = signal(false);

  // ================= Inventory =================

  loadInventory() {
    this.loading.set(true);

    return this.http.get<Inventory[]>(this.apiUrl).pipe(
      tap((response) => {
        this.inventory.set(response);
        console.log('Inventory loaded:', response);
        this.loading.set(false);
      }),
    );
  }

  addStock(productId: number, quantity: number, remarks: string) {
    return this.http
      .put(`${this.apiUrl}/${productId}/add`, {
        quantity,
        remarks,
      })
      .pipe(tap(() => this.loadInventory().subscribe()));
  }

  removeStock(productId: number, quantity: number, remarks: string) {
    return this.http
      .put(`${this.apiUrl}/${productId}/remove`, {
        quantity,
        remarks,
      })
      .pipe(tap(() => this.loadInventory().subscribe()));
  }

  adjustStock(productId: number, quantity: number, remarks: string) {
    return this.http
      .put(`${this.apiUrl}/${productId}/adjust`, {
        quantity,
        remarks,
      })
      .pipe(tap(() => this.loadInventory().subscribe()));
  }

  // ================= Business Day =================

  loadBusinessDay() {
    return this.http.get<BusinessDay | null>(`${this.businessDayApi}/today`).pipe(
      tap((response) => {
        this.businessDay.set(response);
      }),
    );
  }

  startBusinessDay() {
    return this.http.post<void>(`${this.businessDayApi}/start`, {}).pipe(
      tap(() => {
        this.loadBusinessDay().subscribe();
        this.loadInventory().subscribe();
      }),
    );
  }

  generateTodayOrders() {
    return this.http.post<void>(`${this.businessDayApi}/generate-orders`, {}).pipe(
      tap(() => {
        this.loadInventory().subscribe();
      }),
    );
  }

  closeBusinessDay() {
    return this.http.post<void>(`${this.businessDayApi}/close`, {}).pipe(
      tap(() => {
        this.loadBusinessDay().subscribe();
      }),
    );
  }

  // ================= Transactions =================

  loadTransactions() {
    return this.http.get<InventoryTransaction[]>(`${this.apiUrl}/transactions`).pipe(
      tap((response) => {
        this.transactions.set(response);
      }),
    );
  }
}
