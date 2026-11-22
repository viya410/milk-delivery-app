import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPassword {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly token = this.route.snapshot.queryParamMap.get('token') ?? '';
  loading = signal(false);
  success = signal(false);
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  errorMessage = signal('');

  resetPasswordForm = this.fb.nonNullable.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  });

  submit(): void {
    if (this.loading()) return;
    if (!this.token) {
      this.errorMessage.set('This reset link is missing or invalid. Request a new one.');
      return;
    }
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }
    const { password, confirmPassword } = this.resetPasswordForm.getRawValue();
    if (password !== confirmPassword) {
      this.errorMessage.set('Your passwords do not match.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.auth.resetPassword(this.token, password).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error?.error?.message
          || 'This reset link is invalid or has expired. Request a new link and try again.');
      }
    });
  }

  goToLogin(): void {
    void this.router.navigate(['/auth/login']);
  }
}
