import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);

  private apiUrl =
    `${environment.apiUrl}products`;

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