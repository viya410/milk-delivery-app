import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  imageUrl: string;
  quantity: number;
  unit: string;
  maxOrderQuantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/cart`;

  readonly cartItems = signal<CartItem[]>([]);

  readonly loading = signal(false);

  readonly cartCount = computed(() =>
    this.cartItems().reduce((total, item) => total + item.quantity, 0),
  );

  readonly totalAmount = computed(() =>
    this.cartItems().reduce((total, item) => total + item.price * item.quantity, 0),
  );

  loadCart() {
    this.loading.set(true);

    this.http.get<CartItem[]>(this.apiUrl).subscribe({
      next: (items) => {
        this.cartItems.set(items);

        this.loading.set(false);
      },

      error: (err) => {
        console.error(err);

        this.loading.set(false);
      },
    });
  }

  getCart() {
    return this.http.get<CartItem[]>(this.apiUrl).pipe(tap((items) => this.cartItems.set(items)));
  }

  getQuantity(productId: number): number {
    const item = this.cartItems().find((x) => x.productId === productId);

    return item?.quantity ?? 0;
  }

  getCartItem(productId: number): CartItem | undefined {
    return this.cartItems().find((x) => x.productId === productId);
  }

  addToCart(request: { productId: number; quantity: number; productSizeId?: number }) {
    return this.http.post(this.apiUrl, request);
  }

  increaseQuantity(cartId: number) {
    return this.http
      .put(
        `${this.apiUrl}/${cartId}/increase`,

        {},
      )
      ;
  }

  decreaseQuantity(cartId: number) {
    return this.http
      .put(
        `${this.apiUrl}/${cartId}/decrease`,

        {},
      )
      ;
  }

  removeItem(cartId: number) {
    return this.http.delete(`${this.apiUrl}/${cartId}`);
  }

  clearCart() {
    return this.http.delete(`${this.apiUrl}/clear`).pipe(tap(() => this.cartItems.set([])));
  }
}
