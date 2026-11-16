import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth-guard';

export const DELIVERY_PARTNER_ROUTES: Routes = [
  {
    path: '',

    canActivate: [authGuard],

    loadComponent: () =>
      import('../../layouts/dashboard-layout/dashboard-layout').then(
        (m) => m.DashboardLayout,
      ),

    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'available-orders',
        loadComponent: () =>
          import('./pages/available-orders/available-orders').then(
            (m) => m.AvailableOrders,
          ),
      },
      {
        path: 'my-orders',
        loadComponent: () =>
          import('./pages/my-orders/my-orders').then((m) => m.MyOrders),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile').then((m) => m.Profile),
      },
    ],
  },
];