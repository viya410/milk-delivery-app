import { Routes } from '@angular/router';

export const ORDER_SUCCESS_ROUTES: Routes = [
  {
    path: 'order-success',
    loadComponent: () =>
      import('./pages/order-success/order-success')
        .then(m => m.OrderSuccess)
    },
    {
        path: '',
        redirectTo: 'order-success',
        pathMatch: 'full'
    }
];