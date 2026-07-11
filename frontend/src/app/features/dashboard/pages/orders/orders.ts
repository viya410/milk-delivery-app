import { Component, OnInit, computed, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { OrderService } from '../../../../core/services/order';

import { OrderDetailsDialog } from '../../components/order-details-dialog/order-details-dialog';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders implements OnInit {
  private dialog = inject(MatDialog);

  private orderService = inject(OrderService);
  private snackBar = inject(MatSnackBar);

  readonly orders = signal<any[]>([]);

  readonly loading = signal(true);

  readonly statuses = ['ALL', 'PLACED', 'PACKED', 'CANCELLED', 'OUT_FOR_DELIVERY', 'DELIVERED'];

  readonly selectedStatus = signal('ALL');

  readonly searchText = signal('');

  readonly displayedColumns = ['id', 'date', 'products', 'amount', 'status', 'actions'];

  readonly filteredOrders = computed(() => {
    let orders = this.orders();

    const status = this.selectedStatus();

    const search = this.searchText()

      .trim()

      .toLowerCase();

    if (status !== 'ALL') {
      orders = orders.filter((order) => order.status === status);
    }

    if (!search) {
      return orders;
    }

    return orders.filter((order) => {
      const id = order.id.toString();

      const products = order.items

        .map((item: any) => item.productName.toLowerCase())

        .join(' ');

      return (
        id.includes(search) ||
        products.includes(search) ||
        order.status

          .toLowerCase()

          .includes(search)
      );
    });
  });

  readonly totalOrders = computed(() => this.orders().length);

  readonly placedCount = computed(
    () =>
      this.orders()

        .filter((order) => order.status === 'PLACED').length,
  );

  readonly processingCount = computed(
    () =>
      this.orders()

        .filter((order) => order.status === 'PACKED').length,
  );

  readonly deliveryCount = computed(
    () =>
      this.orders()

        .filter((order) => order.status === 'OUT_FOR_DELIVERY').length,
  );

  readonly deliveredCount = computed(
    () =>
      this.orders()

        .filter((order) => order.status === 'DELIVERED').length,
  );

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);

    this.orderService.getOrders().subscribe({
      next: (response) => {
        this.orders.set(response);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  changeFilter(status: string): void {
    this.selectedStatus.set(status);
  }

  updateSearch(value: string): void {
    this.searchText.set(value);
  }

  openOrderDetails(order: any): void {
    this.dialog.open(
      OrderDetailsDialog,

      {
        width: '700px',

        maxWidth: '95vw',

        data: order,
      },
    );
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PLACED':
        return 'Placed';

      case 'PACKED':
        return 'Packed';

      case 'OUT_FOR_DELIVERY':
        return 'Out for Delivery';

      case 'DELIVERED':
        return 'Delivered';

      default:
        return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PLACED':
        return 'placed';

      case 'PACKED':
        return 'packed';

      case 'OUT_FOR_DELIVERY':
        return 'delivery';

      case 'DELIVERED':
        return 'delivered';

      default:
        return '';
    }
  }

  getProductsPreview(order: any): string {
    if (!order.items?.length) {
      return '-';
    }

    if (order.items.length === 1) {
      const item = order.items[0];

      return `${item.productName} × ${item.quantity}`;
    }

    const first = order.items[0];

    return `${first.productName} × ${first.quantity} (+${order.items.length - 1} more)`;
  }

  cancelOrder(order: any): void {
    if (!confirm(`Are you sure you want to cancel Order #${order.id}?`)) {
      return;
    }

    this.orderService.cancelOrder(order.id).subscribe({
      next: () => {
        this.snackBar.open('Order cancelled successfully.', 'Close', {
          duration: 3000,
        });

        this.loadOrders();
      },
      error: (err) => {
        this.snackBar.open(err?.error?.message ?? 'Unable to cancel order.', 'Close', {
          duration: 3000,
        });
      },
    });
  }
}
