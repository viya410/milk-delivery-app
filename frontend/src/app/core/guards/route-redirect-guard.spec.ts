import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { routeRedirectGuard } from './route-redirect-guard';

describe('routeRedirectGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => routeRedirectGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
