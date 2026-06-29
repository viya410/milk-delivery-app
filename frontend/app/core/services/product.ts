import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);

  private apiUrl =
    'http://localhost:8080/api/products';

  getProducts() {

    return this.http.get<any[]>(
      this.apiUrl
    );
  }

  getProductById(id: number) {

    return this.http.get<any>(
      `${this.apiUrl}/${id}`
    );
  }
}