import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard')
        .then(m => m.Dashboard)
  },

  {
    path: 'products',
    loadComponent: () =>
      import('./pages/products/products')
        .then(m => m.Products)
  },

  {
    path: 'inventory',
    loadComponent: () =>
      import('./pages/inventory/inventory/inventory')
        .then(m => m.InventoryComponent)
  },

  {
    path: 'inventory-transactions',
    loadComponent: () =>
      import('./pages/inventory-transaction/inventory-transaction')
        .then(m => m.InventoryTransactions)
  },

  {
    path: 'orders',
    loadComponent: () =>
      import('./pages/orders/orders')
        .then(m => m.Orders)
  },

  {
    path: 'users',
    loadComponent: () =>
      import('./pages/users/users')
        .then(m => m.Users)
  },

  {
    path: 'business-summary',
    loadComponent: () =>
      import('./pages/business-summary/business-summary/business-summary')
        .then(m => m.BusinessSummaryComponent)
  },

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }

];