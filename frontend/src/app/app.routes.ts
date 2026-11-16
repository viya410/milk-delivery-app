import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
import { rootRedirectGuard } from './core/guards/route-redirect-guard';

export const routes: Routes = [
  // Smart root redirect
  {
    path: '',
    canActivate: [rootRedirectGuard],
    children: [],
  },

  // Landing
  {
    path: 'landing',
    loadChildren: () => import('./features/landing/landing.routes').then((m) => m.LANDING_ROUTES),
  },

  // Authentication
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  // Main Application
  {
    path: '',
    loadComponent: () =>
      import('./layouts/public-layout/public-layout').then((m) => m.PublicLayout),

    children: [
      {
        path: 'products',
        loadChildren: () =>
          import('./features/products/products.routes').then((m) => m.PRODUCTS_ROUTES),
      },

      {
        path: 'cart',
        canActivate: [authGuard],
        loadChildren: () => import('./features/cart/cart.routes').then((m) => m.CART_ROUTES),
      },

      {
        path: 'checkout',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./features/checkout/checkout.routes').then((m) => m.CHECKOUT_ROUTES),
      },

      {
        path: 'dashboard',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
      },

      {
        path: 'orders',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/orders/pages/order-history/order-history').then((m) => m.OrderHistory),
      },

      {
        path: 'order-success',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./features/order-success/order-success.routes').then(
            (m) => m.ORDER_SUCCESS_ROUTES,
          ),
      },

      {
        path: 'reviews',
        loadComponent: () =>
          import('./features/reviews/components/review-form/review-form').then((m) => m.ReviewForm),
      },

      {
        path: 'admin',
        canActivate: [authGuard, adminGuard],
        loadComponent: () =>
          import('./layouts/admin-layout/admin-layout').then((m) => m.AdminLayout),

        children: [
          {
            path: '',
            loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
          },
        ],
      },
      {
        path: 'delivery-partner',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./features/delivery-partner/delivery-partner.routes').then(
            (m) => m.DELIVERY_PARTNER_ROUTES,
          ),
      },
    ],
  },

  // Wildcard must always be last
  {
    path: '**',
    redirectTo: '/',
  },
];
