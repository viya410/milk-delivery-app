import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSizeSheet } from './product-size-sheet';

describe('ProductSizeSheet', () => {
  let component: ProductSizeSheet;
  let fixture: ComponentFixture<ProductSizeSheet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSizeSheet],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductSizeSheet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
