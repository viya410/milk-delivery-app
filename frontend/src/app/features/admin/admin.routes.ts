import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'orders',
    loadComponent: () =>
      import('./pages/orders/orders')
        .then(m => m.Orders)
    },
    {
      path: 'products',
      loadComponent: () =>
        import('./pages/products/products')
          .then(m => m.Products)
    },
    {
      path: 'users',
      loadComponent: () =>
        import('./pages/users/users')
          .then(m => m.Users)
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full'
    },
    {
      path: 'dashboard',
      loadComponent: () =>
        import('./pages/dashboard/dashboard')
          .then(m => m.Dashboard)
    }
];