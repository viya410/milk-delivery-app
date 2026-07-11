import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';

import { MatButtonModule } from '@angular/material/button';

import { Product, ProductSize } from '../../../features/products/models/product';

@Component({
  selector: 'app-product-size-sheet',
  standalone: true,
  imports: [
    CommonModule,
    MatBottomSheetModule,
    MatButtonModule,
  ],
  templateUrl: './product-size-sheet.html',
  styleUrl: './product-size-sheet.scss',
})
export class ProductSizeSheet {

  readonly sheetRef =
    inject(MatBottomSheetRef<ProductSizeSheet>);

  readonly product =
    inject<Product>(MAT_BOTTOM_SHEET_DATA);

  readonly selected =
    signal<ProductSize | null>(null);

  select(size: ProductSize) {

    this.selected.set(size);

  }

  add() {

    if (!this.selected()) {

      return;

    }

    this.sheetRef.dismiss(
      this.selected()
    );

  }

}