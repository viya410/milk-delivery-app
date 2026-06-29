import { Routes } from '@angular/router';

export const LANDING_ROUTES: Routes = [
  {
    path: 'landing',
    loadComponent: () =>
      import('./pages/landing/landing')
        .then(m => m.Landing)
    },
    {
        path: '',
        redirectTo: 'landing',
        pathMatch: 'full'
    }
];