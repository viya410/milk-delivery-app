import { Component, OnInit, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';

import { CartService } from '../../../../core/services/cart';
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

  cartItems = signal<any[]>([]);

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (response) => {
        this.cartItems.set(response);
        console.log('Cart Loaded:', response);
      },
    });
  }

  increase(id: number): void {
    this.cartService.increaseQuantity(id).subscribe(() => {
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

  getTotal(): number {
    return this.cartItems().reduce(
      (total, item) => total + item.price * item.quantity,

      0,
    );
  }
}
