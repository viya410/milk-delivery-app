import { Component, inject, signal } from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { RouterLink } from '@angular/router';

import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,

    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPassword {

  private fb = inject(FormBuilder);

  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  resetPasswordForm =
    this.fb.nonNullable.group({

      otp: [
        '',
        [
          Validators.required,
          Validators.minLength(4)
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],

      confirmPassword: [
        '',
        Validators.required
      ]
    });

  submit(): void {

    console.log(
      this.resetPasswordForm.getRawValue()
    );

  }
}