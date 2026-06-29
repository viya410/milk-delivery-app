import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/cart';

  getCart() {
    return this.http.get<any[]>(this.apiUrl);
  }

  addToCart(request: { productId: number; quantity: number }) {
    return this.http.post(this.apiUrl, request);
  }
  increaseQuantity(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/increase`, {});
  }

  decreaseQuantity(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/decrease`, {});
  }

  removeItem(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  clearCart() {
    return this.http.delete(`${this.apiUrl}/clear`);
  }
}
