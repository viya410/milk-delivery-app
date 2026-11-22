import { Injectable, inject, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable, tap } from 'rxjs';

import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
import { RegisterRequest } from '../models/register-request.model';
import { StorageService } from './storage';

import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private storage = inject(StorageService);

  private readonly API_URL = `${environment.apiUrl}/auth`;
  private router = inject(Router);
  private currentUser = signal<User | null>(this.storage.getUser());
  readonly user = this.currentUser.asReadonly();

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${this.API_URL}/login`,

        request,
      )
      .pipe(
        tap((response) => {
          this.storage.setToken(response.token);
          this.storage.setUser(response.user);
          this.currentUser.set(response.user);
          console.log(this.user()?.fullName, this.currentUser());
        }),
      );
  }

  requestPasswordReset(phoneNumber: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/forgot-password`, { phoneNumber });
  }

  resetPassword(phoneNumber: string, otp: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/reset-password`, { phoneNumber, otp, newPassword });
  }

  register(request: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/register`, request);
  }

  registerDeliveryPartner(request: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/delivery-partner/register`, request);
  }

  logout(): void {
    this.storage.clear();
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return !!this.storage.getToken();
  }

  getToken(): string | null {
    return this.storage.getToken();
  }

  saveToken(token: string): void {
    this.storage.setToken(token);
  }

  updateCurrentUser(user: User): void {
    this.currentUser.set(user);

    this.storage.setUser(user);
  }
}
