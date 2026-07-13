import { Component, inject, signal } from '@angular/core';

import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';

import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../../../core/services/auth';

import { ToasterService } from '../../../../core/services/toaster';

import { LoaderService } from '../../../../core/services/loader';

@Component({
  selector: 'app-login',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    RouterLink,
  ],

  templateUrl: './login.html',

  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);

  private authService = inject(AuthService);

  private router = inject(Router);

  private toasterService = inject(ToasterService);

  private loaderService = inject(LoaderService);

  private readonly minimumLoaderTime = 2700;

  loading = false;

  errorMessage = '';

  hidePassword = signal(true);

  loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],

    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit(): void {
    // Prevent duplicate login requests
    if (this.loading) {
      return;
    }

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      this.toasterService.error('Please enter your username and password.');

      return;
    }

    this.loading = true;

    this.errorMessage = '';

    // Remember when the loader started
    const loaderStartedAt = Date.now();

    // Show full-screen video loader
    this.loaderService.show();

    this.authService

      .login(this.loginForm.getRawValue())

      .subscribe({
        next: () => {
          const role = this.authService.user()?.role;

          // Calculate how long the loader
          // has already been visible
          const elapsedTime = Date.now() - loaderStartedAt;

          // Only wait for the remaining time
          const remainingTime = Math.max(0, this.minimumLoaderTime - elapsedTime);

          setTimeout(async () => {
            try {
              if (role === 'ROLE_ADMIN') {
                await this.router.navigateByUrl('/admin/dashboard');
              } else {
                await this.router.navigateByUrl('/dashboard/home');
              }

              this.toasterService.success('Login successful. Welcome back!', 3000);
            } finally {
              this.loading = false;

              this.loaderService.hide();
            }
          }, remainingTime);
        },

        error: () => {
          this.loading = false;

          // Hide immediately on failed login
          this.loaderService.hide();

          this.errorMessage = 'Invalid username or password';

          this.toasterService.error('Invalid username or password.');
        },
      });
  }
}
