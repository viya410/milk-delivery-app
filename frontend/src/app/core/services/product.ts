import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { HttpParams } from '@angular/common/http';
import { ProductCategory } from '../../features/products/models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);

  private apiUrl =
    `${environment.apiUrl}/products`;

  getProducts(category?: ProductCategory) {
    const params = category ? new HttpParams().set('category', category) : new HttpParams();
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  getProductById(id: number) {

    return this.http.get<any>(
      `${this.apiUrl}/${id}`
    );
  }
}