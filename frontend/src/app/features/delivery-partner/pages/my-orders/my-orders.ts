import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpErrorResponse } from '@angular/common/http';

import { DeliveryPartnerService } from '../../../../core/services/delivery-partner';
import { OrderResponse } from '../../../../core/models/order-response';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.scss',
})
export class MyOrders implements OnInit {
  private readonly deliveryPartnerService = inject(DeliveryPartnerService);

  readonly orders = signal<OrderResponse[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal('');
  readonly actionError = signal('');
  readonly actionSuccess = signal('');
  readonly verificationOrderId = signal<number | null>(null);
  readonly otp = signal('');
  readonly verifyingOrderId = signal<number | null>(null);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);
    this.loadError.set('');
    this.deliveryPartnerService.getMyOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loadError.set(this.errorMessage(error, 'Unable to load your orders. Please try again.'));
        this.loading.set(false);
      },
    });
  }

  openVerification(orderId: number): void {
    this.verificationOrderId.set(orderId);
    this.otp.set('');
    this.actionError.set('');
    this.actionSuccess.set('');
  }

  cancelVerification(): void {
    this.verificationOrderId.set(null);
    this.otp.set('');
    this.actionError.set('');
  }

  verifyDelivery(orderId: number): void {
    const code = this.otp().trim();
    if (!/^\d{6}$/.test(code)) {
      this.actionError.set('Enter the 6-digit OTP provided by the customer.');
      return;
    }

    this.verifyingOrderId.set(orderId);
    this.actionError.set('');
    this.actionSuccess.set('');

    this.deliveryPartnerService.verifyDeliveryOtp(orderId, code).subscribe({
      next: (updatedOrder) => {
        this.orders.update((orders) =>
          orders.map((order) => order.id === orderId ? updatedOrder : order)
        );
        this.verifyingOrderId.set(null);
        this.verificationOrderId.set(null);
        this.otp.set('');
        this.actionSuccess.set(`Order #${orderId} marked as delivered.`);
      },
      error: (error: HttpErrorResponse) => {
        this.verifyingOrderId.set(null);
        this.actionError.set(this.errorMessage(error, 'OTP verification failed. Please check the code and try again.'));
      },
    });
  }

  statusLabel(status: string): string {
    return status.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  isInProgress(order: OrderResponse): boolean {
    return order.status === 'OUT_FOR_DELIVERY';
  }

  private errorMessage(error: HttpErrorResponse, fallback: string): string {
    const message = error.error?.message ?? error.error?.error;
    return typeof message === 'string' && message.trim() ? message : fallback;
  }
}
