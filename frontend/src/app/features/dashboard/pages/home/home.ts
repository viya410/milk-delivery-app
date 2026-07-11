import { Component, OnInit, computed, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth';
import { DashboardService } from '../../../../core/services/dashboard';
import { OrderService } from '../../../../core/services/order';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  private readonly orderService = inject(OrderService);

  private readonly router = inject(Router);

  private readonly authService = inject(AuthService);

  readonly userName = this.authService.user()?.fullName ?? 'User';

  readonly loading = computed(() => this.dashboardService.loading() || this.orderService.loading());

  readonly stats = computed(() => {
    const summary = this.dashboardService.summary();

    if (!summary) {
      return [];
    }

    return [
      {
        title: 'Orders',
        value: summary.totalOrders,
        route: '/dashboard/orders',
      },

      {
        title: 'Active Plans',
        value: summary.activePlans,
        route: '/subscriptions',
      },

      {
        title: 'Addresses',
        value: summary.totalAddresses,
        route: '/dashboard/addresses',
      },
    ];
  });

  readonly recentOrders = computed(() => this.orderService.orders().slice(0, 3));

  ngOnInit(): void {
    this.dashboardService.getSummary().subscribe();

    this.orderService.getOrders().subscribe();
  }

  navigateToCard(stat: any): void {
    if (stat.route) {
      this.router.navigate([stat.route]);
    }
  }
}
