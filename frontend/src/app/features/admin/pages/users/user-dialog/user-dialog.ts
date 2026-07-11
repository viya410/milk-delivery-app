import { Component, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import { MatButtonModule } from '@angular/material/button';

import { MatSelectModule } from '@angular/material/select';

import { AdminUser } from '../../../../../core/models/admin-user.model';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './user-dialog.html',
  styleUrl: './user-dialog.scss',
})
export class UserDialog {
  private fb = inject(FormBuilder);

  private dialogRef = inject(MatDialogRef<UserDialog>);

  readonly data = inject(MAT_DIALOG_DATA) as AdminUser | null;

  readonly roles = ['ROLE_USER', 'ROLE_ADMIN'];

  readonly form = this.fb.group({
    id: [0],

    fullName: ['', Validators.required],

    email: ['', [Validators.required, Validators.email]],

    phoneNumber: ['', Validators.required],

    role: ['ROLE_USER', Validators.required],
  });

  constructor() {
    if (this.data) {
      this.form.patchValue({
        id: this.data.id,

        fullName: this.data.fullName,

        email: this.data.email,

        phoneNumber: this.data.phoneNumber,

        role: this.data.role,
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    this.dialogRef.close(this.form.getRawValue());
  }
}
