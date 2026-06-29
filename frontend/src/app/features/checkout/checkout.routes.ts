import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';

export const CHECKOUT_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/checkout/checkout')
        .then(m => m.Checkout)
  }
];