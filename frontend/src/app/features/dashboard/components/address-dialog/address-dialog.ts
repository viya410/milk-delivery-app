import { Component, inject } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-address-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './address-dialog.html',
  styleUrl: './address-dialog.scss'
})
export class AddressDialog {

  private fb = inject(FormBuilder);

  readonly dialogRef = inject(MatDialogRef<AddressDialog>);

  readonly data = inject(MAT_DIALOG_DATA, {
    optional: true
  });

  readonly isEdit = !!this.data;

  readonly addressForm = this.fb.nonNullable.group({

    customerName: [
      this.data?.customerName ?? '',
      Validators.required
    ],

    mobileNumber: [
      this.data?.mobileNumber ?? '',
      [
        Validators.required,
        Validators.pattern(/^[6-9]\d{9}$/)
      ]
    ],

    houseNo: [
      this.data?.houseNo ?? '',
      Validators.required
    ],

    street: [
      this.data?.street ?? '',
      Validators.required
    ],

    city: [
      this.data?.city ?? '',
      Validators.required
    ],

    state: [
      this.data?.state ?? '',
      Validators.required
    ],

    pincode: [
      this.data?.pincode ?? '',
      [
        Validators.required,
        Validators.pattern(/^\d{6}$/)
      ]
    ]

  });

  save(): void {

    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.addressForm.getRawValue());

  }

  cancel(): void {
    this.dialogRef.close();
  }
}