import { TestBed } from '@angular/core/testing';

import { BusinessSummary } from './business-summary';

describe('BusinessSummary', () => {
  let service: BusinessSummary;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessSummary);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
