import { Component, inject } from '@angular/core';
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

  visible(): boolean {
    return this.auth.isLoggedIn() && this.auth.user()?.role !== 'ROLE_ADMIN';
  }

  isActive(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(path + '/');
  }
}
