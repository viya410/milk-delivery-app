import { Component, inject } from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-inventory-dialog',

  standalone: true,

  imports: [

    CommonModule,

    ReactiveFormsModule,

    MatButtonModule,

    MatInputModule,

    MatFormFieldModule

  ],

  templateUrl: './inventory-dialog.html',

  styleUrl: './inventory-dialog.scss'

})
export class InventoryDialog {

  private fb = inject(FormBuilder);

  readonly dialogRef = inject(MatDialogRef<InventoryDialog>);

  readonly data = inject(MAT_DIALOG_DATA);

  form = this.fb.group({

    quantity: [

      0,

      [

        Validators.required,

        Validators.min(0.01)

      ]

    ],

    remarks: [

      ''

    ]

  });

  get title(): string {

    switch (this.data.action) {

      case 'ADD':

        return 'Add Stock';

      case 'REMOVE':

        return 'Remove Stock';

      case 'ADJUST':

        return 'Adjust Stock';

      default:

        return 'Inventory';

    }

  }

  save(): void {

    if (

      this.form.invalid

    ) {

      return;

    }

    this.dialogRef.close(

      this.form.getRawValue()

    );

  }

}