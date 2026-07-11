import { Injectable, inject, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { tap } from 'rxjs/operators';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { AdminProduct } from '../models/admin-product.model';

@Injectable({
  providedIn: 'root'
})
export class AdminProductService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/admin/products`;

  readonly products = signal<AdminProduct[]>([]);

  readonly loading = signal(false);

  loadProducts(): Observable<AdminProduct[]> {

    this.loading.set(true);

    return this.http
      .get<AdminProduct[]>(this.apiUrl)
      .pipe(
        tap(products => {

          this.products.set(products);

          this.loading.set(false);

        })
      );

  }

  addProduct(product: AdminProduct) {

    return this.http
      .post<AdminProduct>(
        this.apiUrl,
        product
      )
      .pipe(
        tap(() => {

          this.loadProducts().subscribe();

        })
      );

  }

  updateProduct(product: AdminProduct) {

    return this.http
      .put<AdminProduct>(
        `${this.apiUrl}/${product.id}`,
        product
      )
      .pipe(
        tap(() => {

          this.loadProducts().subscribe();

        })
      );

  }

  deleteProduct(id: number) {

    return this.http
      .delete(
        `${this.apiUrl}/${id}`
      )
      .pipe(
        tap(() => {

          this.loadProducts().subscribe();

        })
      );

  }

}