import {
  Component,
  OnInit,
  computed,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { Router, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../../../core/services/auth';
import { DashboardService } from '../../../../core/services/dashboard';
import { OrderService } from '../../../../core/services/order';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {

  private dashboardService =
    inject(DashboardService);

  private orderService =
    inject(OrderService);

  private router =
    inject(Router);

  private authService =
    inject(AuthService);

  userName =
    this.authService.user()?.fullName || 'User';

  loading = computed(() =>
    this.dashboardService.loading() ||
    this.orderService.loading()
  );

  stats = computed(() => {

    const summary =
      this.dashboardService.summary();

    if (!summary) {

      return [];

    }

    return [

      {
        title: 'Orders',
        value: summary.totalOrders,
        clickable: true,
        route: '/dashboard/orders'
      },

      {
        title: 'Active Plans',
        value: summary.activePlans,
        clickable: true,
        route: '/subscriptions'
      },

      {
        title: 'Addresses',
        value: summary.totalAddresses,
        clickable: true,
        route: '/dashboard/addresses'
      }

    ];

  });

  recentOrders = computed(() =>

    this.orderService.orders().slice(0, 3)

  );

  ngOnInit(): void {

    this.dashboardService.getSummary().subscribe();

    this.orderService.getOrders().subscribe();

  }

  navigateToCard(stat: any): void {

    if (stat.clickable && stat.route) {

      this.router.navigate([stat.route]);

    }

  }

}