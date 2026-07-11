import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessSummary } from './business-summary';

describe('BusinessSummary', () => {
  let component: BusinessSummary;
  let fixture: ComponentFixture<BusinessSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessSummary],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
