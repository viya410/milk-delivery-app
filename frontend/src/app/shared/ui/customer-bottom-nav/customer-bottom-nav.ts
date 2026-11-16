import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { filter } from 'rxjs/operators';

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

  private readonly routeChanges = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
  );

  navigationMode(): 'delivery-partner' | 'admin' | 'customer' | 'hidden' {
    if (!this.auth.isLoggedIn()) return 'hidden';

    // The route is the most reliable discriminator here: the delivery-partner
    // area is nested inside the shared public/dashboard shell.
    if (this.router.url.startsWith('/delivery-partner')) return 'delivery-partner';
    if (this.router.url.startsWith('/admin')) return 'admin';

    const role = this.auth.user()?.role;
    if (role === 'ROLE_DELIVERY_PARTNER') return 'delivery-partner';
    if (role === 'ROLE_ADMIN') return 'admin';
    return 'customer';
  }

  isActive(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(path + '/');
  }
}
