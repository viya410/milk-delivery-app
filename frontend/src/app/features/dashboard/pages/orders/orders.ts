import { Component, inject, OnInit, signal } from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialog,
  MatDialogModule
} from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

import {
  OrderDetailsDialog
} from '../../components/order-details-dialog/order-details-dialog';
import { OrderService } from '../../../../core/services/order';

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
    MatDialogModule
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.scss'
})
export class Orders implements OnInit {

  private dialog = inject(MatDialog);
  private orderService = inject(OrderService);

  orders = signal<any[]>([]);

  loading = signal(true);

  displayedColumns = [
    'id',
    'date',
    'products',
    'amount',
    'status',
    'actions'
  ];

  openOrderDetails(
    order: any
  ): void {

    this.dialog.open(
      OrderDetailsDialog,
      {
        width: '500px',
        data: order
      }
    );

  }

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