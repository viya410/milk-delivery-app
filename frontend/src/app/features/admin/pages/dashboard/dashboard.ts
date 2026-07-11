import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

import { Router } from '@angular/router';

import { AdminService } from '../../../../core/services/admin';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  readonly adminService = inject(AdminService);

  private router = inject(Router);

  ngOnInit(): void {

    this.adminService
      .loadDashboard()
      .subscribe();

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

  getCustomerInitials(name?: string | null): string {

    if (!name) {

      return '?';

    }

    return name

      .split(' ')

      .map(part => part[0])

      .join('')

      .toUpperCase();

  }

  navigate(path: string): void {

    this.router.navigate([path]);

  }
  goToPendingOrders(): void {

  this.router.navigate(
    ['/admin/orders'],
    {
      queryParams: {
        status: 'PLACED'
      }
    }
  );

}

goToDeliveredOrders(): void {

  this.router.navigate(
    ['/admin/orders'],
    {
      queryParams: {
        status: 'DELIVERED'
      }
    }
  );

}

}