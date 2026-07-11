import { Component, OnInit, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';

import { OrderService } from '../../../../core/services/order';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.html',
  styleUrl: './order-history.scss',
})
export class OrderHistory implements OnInit {
  private orderService = inject(OrderService);

  orders = signal<any[]>([]);

  loading = signal(true);

  ngOnInit(): void {
    this.orderService.getOrders().subscribe({
      next: (response) => {
        console.log('Order History Response:', response);
        this.orders.set(response);

        this.loading.set(false);
      },
    });
  }
}
