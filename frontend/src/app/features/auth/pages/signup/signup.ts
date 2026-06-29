import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { inject } from '@angular/core';

import { RouterLink } from '@angular/router';

import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    RouterLink,

    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {

  private router = inject(Router);

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  signupForm = this.fb.nonNullable.group({

    fullName: [
      '',
      [
        Validators.required,
        Validators.minLength(3)
      ]
    ],

    mobileNumber: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]
    ],

    email: [
      '',
      [
        Validators.email
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
    ],

    termsAccepted: [
      false,
      Validators.requiredTrue
    ]
  });

 submit(): void {

  if (this.signupForm.invalid) {
    this.signupForm.markAllAsTouched();
    return;
  }

  const formValue =
    this.signupForm.getRawValue();

  if (
    formValue.password !==
    formValue.confirmPassword
  ) {

    alert(
      'Passwords do not match'
    );

    return;
  }

  const payload = {

    fullName:
      formValue.fullName,

    phoneNumber:
      formValue.mobileNumber,

    email:
      formValue.email,

    password:
      formValue.password
  };

  this.authService
    .register(payload)
    .subscribe({

      next: (response) => {

        console.log(response);

        alert(
          'Account created successfully'
        );

        this.router.navigate([
          '/auth/login'
        ]);
      },

      error: (error) => {

        console.error(error);

        alert(
          error?.error ??
          'Signup failed'
        );
      }
    });
}
}