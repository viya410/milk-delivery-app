import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../../core/services/order';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-history.html',
  styleUrl: './order-history.scss',
})
export class OrderHistory implements OnInit {
  private readonly orderService = inject(OrderService);
  readonly orders = signal<any[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.orderService.getOrders().subscribe({
      next: (response) => {
        this.orders.set(response ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('We could not load your orders. Check your connection and try again.');
        this.loading.set(false);
      }
    });
  }

  statusLabel(status: string | undefined): string {
    if (!status) return 'Status unavailable';
    return status.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  statusClass(status: string | undefined): string {
    return (status ?? 'unknown').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
}
