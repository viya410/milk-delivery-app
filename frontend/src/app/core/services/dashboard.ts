import { Injectable, inject, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { DashboardSummary } from '../models/dashboard-summary.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  private http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/dashboard`;

  readonly summary =
    signal<DashboardSummary | null>(null);

  readonly loading =
    signal(false);

  getSummary() {

    this.loading.set(true);

    return this.http
      .get<DashboardSummary>(`${this.apiUrl}/summary`)
      .pipe(

        tap(summary => {

          this.summary.set(summary);

          this.loading.set(false);

        })

      );

  }

  refreshSummary(): void {

    this.getSummary().subscribe();

  }

}