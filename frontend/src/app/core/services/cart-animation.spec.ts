import { TestBed } from '@angular/core/testing';

import { CartAnimation } from './cart-animation';

describe('CartAnimation', () => {
  let service: CartAnimation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartAnimation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
