import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

import { ProductService } from '../../../../core/services/product';

@Component({
  selector: 'app-subscription-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  templateUrl: './subscription-dialog.html',
  styleUrl: './subscription-dialog.scss'
})
export class SubscriptionDialog {

  private fb = inject(FormBuilder);

  private productService = inject(ProductService);

  readonly dialogRef = inject(MatDialogRef<SubscriptionDialog>);

  readonly data = inject(MAT_DIALOG_DATA, {
    optional: true
  });

  readonly products = signal<any[]>([]);

  readonly frequencies = [
    'DAILY',
    'ALTERNATE_DAY',
    'WEEKLY'
  ];

  subscriptionForm = this.fb.group({

    productId: [
      '',
      Validators.required
    ],

    quantity: [
      1,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],

    frequency: [
      'DAILY',
      Validators.required
    ],

    startDate: [
      new Date(),
      Validators.required
    ],

    endDate: [
      null
    ]

  });

  constructor() {

    this.productService
      .getProducts()
      .subscribe(products => {

        this.products.set(products);

      });

  }

  save(): void {

    if (this.subscriptionForm.invalid) {

      this.subscriptionForm.markAllAsTouched();

      return;

    }

    const value = this.subscriptionForm.getRawValue();

    this.dialogRef.close({

      productId: Number(value.productId),

      quantity: Number(value.quantity),

      frequency: value.frequency,

      startDate: value.startDate
        ? new Date(value.startDate).toISOString().split('T')[0]
        : null,

      endDate: value.endDate
        ? new Date(value.endDate).toISOString().split('T')[0]
        : null

    });

  }

  cancel(): void {

    this.dialogRef.close();

  }

}