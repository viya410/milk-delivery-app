import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth-guard';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',

    canActivate: [authGuard],

    loadComponent: () =>
      import('../../layouts/dashboard-layout/dashboard-layout').then((m) => m.DashboardLayout),

    children: [
      {
        path: '',

        redirectTo: 'home',

        pathMatch: 'full',
      },

      {
        path: 'home',

        loadComponent: () => import('./pages/home/home').then((m) => m.Home),
      },

      {
        path: 'profile',

        loadComponent: () => import('./pages/profile/profile').then((m) => m.Profile),
      },

      {
        path: 'orders',

        loadComponent: () => import('./pages/orders/orders').then((m) => m.Orders),
      },

      {
        path: 'settings',

        loadComponent: () => import('./pages/settings/settings').then((m) => m.Settings),
      },

      {
        path: 'addresses',

        loadComponent: () => import('./pages/addresses/addresses').then((m) => m.Addresses),
      },
      {
        path: 'subscriptions',
        loadComponent: () => import('./pages/subscriptions/subscriptions').then((m) => m.Subscriptions),
      }
    ],
  },
];
