import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';

export const ORDER_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/order-history/order-history')
        .then(m => m.OrderHistory)
  }
];