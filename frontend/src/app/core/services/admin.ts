import { Injectable, inject, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { AdminDashboard } from '../models/admin-dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/admin`;

  readonly dashboard = signal<AdminDashboard | null>(null);

  readonly loading = signal(false);

  loadDashboard() {

    this.loading.set(true);

    return this.http

      .get<AdminDashboard>(
        `${this.apiUrl}/dashboard`
      )

      .pipe(

        tap((response) => {

          this.dashboard.set(response);

          this.loading.set(false);

        })

      );

  }

}