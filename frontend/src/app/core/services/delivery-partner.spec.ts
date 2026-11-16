import { TestBed } from '@angular/core/testing';

import { DeliveryPartner } from './delivery-partner';

describe('DeliveryPartner', () => {
  let service: DeliveryPartner;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryPartner);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
