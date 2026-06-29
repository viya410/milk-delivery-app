import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  {
    path: 'landing',
    loadChildren: () =>
      import('./features/landing/landing.routes').then((m) => m.LANDING_ROUTES),
  },

  {
    path: '',
    loadComponent: () =>
      import('./layouts/public-layout/public-layout').then(
        (m) => m.PublicLayout
      ),

    children: [
      {
        path: 'products',
        loadChildren: () =>
          import('./features/products/products.routes').then(
            (m) => m.PRODUCTS_ROUTES
          ),
      },

      {
        path: 'cart',
        loadChildren: () =>
          import('./features/cart/cart.routes').then(
            (m) => m.CART_ROUTES
          ),
      },

      {
        path: 'checkout',
        loadChildren: () =>
          import('./features/checkout/checkout.routes').then(
            (m) => m.CHECKOUT_ROUTES
          ),
      },

      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then(
            (m) => m.DASHBOARD_ROUTES
          ),
      },

      {
        path: 'admin',
        loadChildren: () =>
          import('./features/admin/admin.routes').then(
            (m) => m.ADMIN_ROUTES
          ),
      },

      {
        path: 'order-success',
        loadChildren: () =>
          import('./features/order-success/order-success.routes').then(
            (m) => m.ORDER_SUCCESS_ROUTES
          ),
      },

      {
        path: 'orders',
        loadComponent: () =>
          import(
            './features/orders/pages/order-history/order-history'
          ).then((m) => m.OrderHistory),
      },
    ],
  },

  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },

  {
    path: '**',
    redirectTo: 'landing',
  },
];