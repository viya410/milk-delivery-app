import { Component, OnInit, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';

import { CartService, CartItem } from '../../../../core/services/cart';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnInit {
  private cartService = inject(CartService);

  cartItems = signal<CartItem[]>([]);

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (response) => {
        response.sort((a, b) => a.id - b.id);

        this.cartItems.set(response);
      },

      error: (error) => {
        console.error(error);
      },
    });
  }

  increase(item: CartItem): void {
    if (this.isMaxReached(item)) {
      return;
    }

    this.cartService.increaseQuantity(item.id).subscribe(() => {
      this.loadCart();
    });
  }

  decrease(id: number): void {
    this.cartService.decreaseQuantity(id).subscribe(() => {
      this.loadCart();
    });
  }

  remove(id: number): void {
    this.cartService.removeItem(id).subscribe(() => {
      this.loadCart();
    });
  }

  isMaxReached(item: CartItem): boolean {
    return item.quantity >= item.maxOrderQuantity;
  }

  getTotal(): number {
    return this.cartItems().reduce(
      (total, item) => total + item.price * item.quantity,

      0,
    );
  }
}
