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

  dialogRef =
    inject(MatDialogRef<AddressDialog>);

  data = inject(MAT_DIALOG_DATA, {
    optional: true
  });

  addressForm = this.fb.nonNullable.group({

    type: [
      this.data?.type ?? '',
      Validators.required
    ],

    name: [
      this.data?.name ?? '',
      Validators.required
    ],

    addressLine: [
      this.data?.addressLine ?? '',
      Validators.required
    ],

    city: [
      this.data?.city ?? '',
      Validators.required
    ]
  });

  save(): void {

    this.dialogRef.close(
      this.addressForm.getRawValue()
    );

  }

  cancel(): void {

    this.dialogRef.close();

  }
}