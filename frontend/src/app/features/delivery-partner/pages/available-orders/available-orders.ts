import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { DeliveryPartnerService } from '../../../../core/services/delivery-partner';
import { OrderResponse } from '../../../../core/models/order-response';

@Component({
  selector: 'app-available-orders',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './available-orders.html',
  styleUrl: './available-orders.scss',
})
export class AvailableOrders implements OnInit {
  private readonly deliveryPartnerService = inject(DeliveryPartnerService);

  readonly orders = signal<OrderResponse[]>([]);

  readonly loading = signal(true);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);

    this.deliveryPartnerService.getAvailableOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: (error) => {
        console.error(error);
        this.loading.set(false);
      },
    });
  }

  pickOrder(orderId: number): void {
    this.deliveryPartnerService.pickOrder(orderId).subscribe({
      next: () => {
        this.orders.update((orders) => orders.filter((order) => order.id !== orderId));
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
