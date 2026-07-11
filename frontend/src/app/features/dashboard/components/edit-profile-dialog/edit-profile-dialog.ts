import { Component, inject } from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  MatDialogRef
} from '@angular/material/dialog';

import { CommonModule } from '@angular/common';

import { MatDialogModule } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-edit-profile-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './edit-profile-dialog.html',
  styleUrl: './edit-profile-dialog.scss'
})
export class EditProfileDialog {

  private fb = inject(FormBuilder);

  dialogRef =
    inject(
      MatDialogRef<EditProfileDialog>
    );

  profileForm =
    this.fb.nonNullable.group({

      fullName: [
        'Vishnu',
        Validators.required
      ],

      mobileNumber: [
        '9876543210',
        Validators.required
      ],

      email: [
        'vishnu@gmail.com'
      ]

    });

  save(): void {

    console.log(
      this.profileForm.getRawValue()
    );

    this.dialogRef.close(
      this.profileForm.getRawValue()
    );
  }

  cancel(): void {

    this.dialogRef.close();

  }
}