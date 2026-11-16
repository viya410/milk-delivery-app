import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../../../core/services/auth';
import { DeliveryPartnerService } from '../../../../core/services/delivery-partner';
import { DeliveryPartnerProfile } from '../../../../core/models/delivery-partner-profile';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private readonly deliveryPartnerService = inject(DeliveryPartnerService);
  private readonly authService = inject(AuthService);

  readonly profile = signal<DeliveryPartnerProfile | null>(null);
  readonly loading = signal(true);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    const user = this.authService.user();
    if (user) {
      this.profile.set({
        id: null,
        fullName: user.fullName,
        email: user.email || null,
        phoneNumber: user.phoneNumber,
        employeeCode: null,
        routeId: null,
        routeName: null,
        status: 'UNKNOWN',
      });
    }
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.deliveryPartnerService.getProfile().subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        const message = error.error?.message ?? error.error?.error;
        this.errorMessage.set(
          typeof message === 'string' && message.trim()
            ? message
            : 'Partner details could not be loaded. Your basic account information is shown below.'
        );
        this.loading.set(false);
      },
    });
  }

  logout(): void {
    this.authService.logout();
  }

  get initials(): string {
    const name = this.profile()?.fullName?.trim();
    if (!name) return 'DP';
    return name.split(/\s+/).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('');
  }

  statusLabel(status: string | undefined): string {
    if (!status) return 'Unknown';
    return status.charAt(0) + status.slice(1).toLowerCase();
  }
}
