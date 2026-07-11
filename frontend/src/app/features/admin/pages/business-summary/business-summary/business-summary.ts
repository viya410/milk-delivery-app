import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { BusinessSummaryService } from '../../../../../core/services/business-summary';

@Component({
  selector: 'app-business-summary',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './business-summary.html',
  styleUrl: './business-summary.scss',
})
export class BusinessSummaryComponent implements OnInit {

  readonly summaryService = inject(BusinessSummaryService);

  readonly summary = this.summaryService.summary;

  readonly loading = this.summaryService.loading;

  readonly products = computed(
    () => this.summary()?.products ?? []
  );

  readonly revenueCards = computed(() => {

    const summary = this.summary();

    if (!summary) {
      return [];
    }

    return [
      {
        title: 'Revenue',
        icon: 'payments',
        value: `₹${summary.totalRevenue.toFixed(2)}`,
      },
      {
        title: 'Orders',
        icon: 'shopping_bag',
        value: summary.totalOrders,
      },
      {
        title: 'Customers',
        icon: 'groups',
        value: summary.totalCustomers,
      },
      {
        title: 'Delivered',
        icon: 'local_shipping',
        value: summary.deliveredOrders,
      },
    ];

  });

  ngOnInit(): void {

    this.summaryService
      .loadSummary()
      .subscribe();

  }

}