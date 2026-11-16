import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableOrders } from './available-orders';

describe('AvailableOrders', () => {
  let component: AvailableOrders;
  let fixture: ComponentFixture<AvailableOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableOrders],
    }).compileComponents();

    fixture = TestBed.createComponent(AvailableOrders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
