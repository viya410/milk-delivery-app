import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeliveryPartnerService } from '../../../../core/services/delivery-partner';
import { DeliveryPartnerDashboard } from '../../../../core/models/delivery-partner-dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly deliveryPartnerService = inject(DeliveryPartnerService);
  readonly dashboard = signal<DeliveryPartnerDashboard | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.loading.set(true);
    this.deliveryPartnerService.getDashboard().subscribe({
      next: (response) => {
        this.dashboard.set(response);
        this.loading.set(false);
      },
      error: (error) => {
        console.error(error);
        this.loading.set(false);
      },
    });
  }
}