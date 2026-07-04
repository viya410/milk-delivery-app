import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from '../services/auth';

export const rootRedirectGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {

    return router.createUrlTree(['/dashboard']);

  }

  return router.createUrlTree(['/landing']);

};