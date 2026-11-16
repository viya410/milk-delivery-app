import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-customer-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './customer-bottom-nav.html',
  styleUrl: './customer-bottom-nav.scss',
})
export class CustomerBottomNavComponent {
  readonly auth = inject(AuthService);
  readonly router = inject(Router);

  @Input() deliveryPartnerOnly = false;

  isDeliveryPartner(): boolean {
    return this.auth.user()?.role === 'ROLE_DELIVERY_PARTNER';
  }

  isAdmin(): boolean {
    return this.auth.user()?.role === 'ROLE_ADMIN';
  }

  visible(): boolean {
    if (!this.auth.isLoggedIn()) return false;

    if (this.deliveryPartnerOnly) return this.isDeliveryPartner();

    const role = this.auth.user()?.role;
    return this.isAdmin() || role === 'ROLE_CUSTOMER' || role === 'ROLE_USER';
  }

  isActive(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(path + '/');
  }
}
