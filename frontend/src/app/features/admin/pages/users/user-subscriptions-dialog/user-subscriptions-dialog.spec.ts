import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSubscriptionsDialog } from './user-subscriptions-dialog';

describe('UserSubscriptionsDialog', () => {
  let component: UserSubscriptionsDialog;
  let fixture: ComponentFixture<UserSubscriptionsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSubscriptionsDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(UserSubscriptionsDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
