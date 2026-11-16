import { Component, inject } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';

import { MatInputModule } from '@angular/material/input';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatSelectModule } from '@angular/material/select';
import { ProductSize } from '../../../../../../app/core/models/admin-product.model';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-dialog',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    FormsModule,
    MatIconModule,
    MatSelectModule,
  ],

  templateUrl: './product-dialog.html',

  styleUrl: './product-dialog.scss',
})
export class ProductDialog {
  private fb = inject(FormBuilder);

  readonly dialogRef = inject(MatDialogRef<ProductDialog>);

  readonly data = inject(MAT_DIALOG_DATA, {
    optional: true,
  });

  productImages = ['milk-1l.jpg', 'milk-500ml.jpg', 'curd-500g.jpg', 'ghee-1l.jpg'];

  sizes: ProductSize[] = this.data?.sizes ? [...this.data.sizes] : [];

  form = this.fb.group({
    id: [this.data?.id],

    name: [this.data?.name ?? '', Validators.required],

    category: [this.data?.category ?? 'DAIRY', Validators.required],

    description: [this.data?.description ?? ''],

    price: [this.data?.price ?? 1, [Validators.required, Validators.min(1)]],

    maxOrderQuantity: [
      this.data?.maxOrderQuantity ?? 3,
      [Validators.required, Validators.min(0.1)],
    ],

    unit: [this.data?.unit ?? 'L', Validators.required],

    category: [this.data?.category ?? 'DAIRY', Validators.required],

    imageUrl: [this.data?.imageUrl ?? ''],

    available: [this.data?.available ?? true],
  });

  save() {
    if (this.form.invalid) {
      console.log('Form is invalid:', this.form.errors, this.form.controls);
      this.form.markAllAsTouched();
      return;
    }

    const product = {
      ...this.form.getRawValue(),
      sizes: this.sizes,
      hasSizeSelection: this.sizes.length > 0,
    };

    this.dialogRef.close(product);
    console.log('Saving Product:', JSON.stringify(product, null, 2));
  }
  addSize(): void {
    this.sizes.push({
      size: this.availableSizes[0],
      price: 0,
    });
  }

  removeSize(index: number): void {
    this.sizes.splice(index, 1);
  }

  get availableSizes(): string[] {
    switch (this.form.get('unit')?.value) {
      case 'L':
        return ['500ML', '1L', '2L'];

      case 'ML':
        return ['250ML', '500ML', '750ML', '1000ML'];

      case 'GM':
        return ['100GM', '250GM', '500GM', '1KG'];

      case 'KG':
        return ['500GM', '1KG', '2KG'];

      case 'PCS':
        return ['1PC', '2PCS', '6PCS', '12PCS'];

      default:
        return [];
    }
  }
}
