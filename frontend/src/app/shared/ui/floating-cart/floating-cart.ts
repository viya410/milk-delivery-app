import { Component, computed, inject, signal } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';

import { filter } from 'rxjs/operators';

import { AuthService } from '../../../core/services/auth';
import { CartService } from '../../../core/services/cart';

@Component({
  selector: 'app-floating-cart',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './floating-cart.html',
  styleUrl: './floating-cart.scss',
})
export class FloatingCartComponent {
  readonly cartService = inject(CartService);
  readonly authService = inject(AuthService);

  private readonly router = inject(Router);

  readonly cartCount = this.cartService.cartCount;

  private readonly currentRoute = signal(this.router.url);

  private readonly hiddenRoutes = [
    '/cart',
    '/checkout',
    '/order-success',
  ];

  readonly showCart = computed(() => {
    const isHiddenRoute = this.hiddenRoutes.some(route =>
      this.currentRoute().startsWith(route)
    );

    return (
      this.authService.isLoggedIn() &&
      this.authService.user()?.role !== 'ROLE_ADMIN' &&
      !isHiddenRoute
    );
  });

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.currentRoute.set(this.router.url);
      });
  }
}