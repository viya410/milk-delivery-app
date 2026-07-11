import { Component, OnInit, inject, signal, computed } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ActivatedRoute } from '@angular/router';

import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';

import { MatSelectModule } from '@angular/material/select';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatIconModule } from '@angular/material/icon';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AdminOrderService } from '../../../../core/services/admin-order';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders implements OnInit {
  readonly orderService = inject(AdminOrderService);

  private route = inject(ActivatedRoute);

  private snackBar = inject(MatSnackBar);

  readonly statuses = ['ALL', 'PACKED', 'PLACED', 'CANCELLED', 'OUT_FOR_DELIVERY', 'DELIVERED'];

  readonly selectedStatus = signal('ALL');

  readonly searchText = signal('');

  readonly filteredOrders = computed(() => {
    let orders = this.orderService.orders();

    const status = this.selectedStatus();

    const search = this.searchText()

      .trim()

      .toLowerCase();
    if (status === 'PENDING') {
      orders = orders.filter(
        (order) =>
          order.status === 'PLACED' ||
          order.status === 'PACKED' ||
          order.status === 'OUT_FOR_DELIVERY',
      );
    } else {
      switch (status) {
        case 'PLACED':
          orders = orders.filter((o) => o.status === 'PLACED');

          break;

        case 'PACKED':
          orders = orders.filter((o) => o.status === 'PACKED');

          break;

        case 'OUT_FOR_DELIVERY':
          orders = orders.filter((o) => o.status === 'OUT_FOR_DELIVERY');

          break;

        case 'DELIVERED':
          orders = orders.filter((o) => o.status === 'DELIVERED');

          break;
      }
    }

    switch (status) {
      case 'PLACED':
        orders = orders.filter((o) => o.status === 'PLACED');

        break;

      case 'PACKED':
        orders = orders.filter((o) => o.status === 'PACKED');

        break;

      case 'OUT_FOR_DELIVERY':
        orders = orders.filter((o) => o.status === 'OUT_FOR_DELIVERY');

        break;

      case 'DELIVERED':
        orders = orders.filter((o) => o.status === 'DELIVERED');

        break;
    }

    if (!search) {
      return orders;
    }

    return orders.filter((order) => {
      const customer = order.user?.fullName?.toLowerCase() ?? '';

      const phone = order.user?.phoneNumber ?? '';

      const amount = order.totalAmount.toString();

      const id = order.id.toString();

      return (
        customer.includes(search) ||
        phone.includes(search) ||
        amount.includes(search) ||
        id.includes(search)
      );
    });
  });

  readonly totalOrders = computed(() => this.orderService.orders().length);

  readonly placedCount = computed(
    () =>
      this.orderService
        .orders()

        .filter((o) => o.status === 'PLACED').length,
  );

  readonly processingCount = computed(
    () =>
      this.orderService
        .orders()

        .filter((o) => o.status === 'PACKED').length,
  );

  readonly deliveryCount = computed(
    () =>
      this.orderService
        .orders()

        .filter((o) => o.status === 'OUT_FOR_DELIVERY').length,
  );

  readonly deliveredCount = computed(
    () =>
      this.orderService
        .orders()

        .filter((o) => o.status === 'DELIVERED').length,
  );

  ngOnInit(): void {
    this.orderService

      .loadOrders()

      .subscribe();

    this.route.queryParamMap.subscribe((params) => {
      const status = params.get('status');

      const filter = params.get('filter');

      if (filter === 'pending') {
        this.selectedStatus.set('PENDING');
        return;
      }

      if (status) {
        this.selectedStatus.set(status);

        return;
      }

      this.selectedStatus.set('ALL');
    });
  }
  changeFilter(status: string): void {
    this.selectedStatus.set(status);
  }

  updateSearch(value: string): void {
    this.searchText.set(value);
  }

  updateStatus(id: number, status: string): void {
    this.orderService

      .updateStatus(id, status)

      .subscribe({
        next: () => {
          this.snackBar.open(
            'Order status updated successfully.',

            'Close',

            {
              duration: 2500,

              horizontalPosition: 'right',

              verticalPosition: 'top',
            },
          );
        },

        error: () => {
          this.snackBar.open(
            'Failed to update order status.',

            'Close',

            {
              duration: 2500,

              horizontalPosition: 'right',

              verticalPosition: 'top',
            },
          );
        },
      });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      ALL: 'All',

      CANCELLED: 'Cancelled',

      PLACED: 'Placed',

      PACKED: 'Packed',

      OUT_FOR_DELIVERY: 'Out for Delivery',

      DELIVERED: 'Delivered',
    };

    return labels[status] ?? status;
  }

  getCustomerInitials(name?: string | null): string {
    if (!name) {
      return '?';
    }

    return name

      .trim()

      .split(' ')

      .map((part) => part[0])

      .join('')

      .substring(0, 2)

      .toUpperCase();
  }
}
