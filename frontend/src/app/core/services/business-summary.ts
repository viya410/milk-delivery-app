import { Injectable, inject, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { tap } from 'rxjs';

import { environment } from '../../../environments/environment';

import { BusinessSummary } from '../models/business-summary.model';

@Injectable({
  providedIn: 'root',
})
export class BusinessSummaryService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/admin/business-day`;

  readonly summary = signal<BusinessSummary | null>(null);

  readonly loading = signal(false);

  loadSummary() {
    this.loading.set(true);

    return this.http
      .get<BusinessSummary>(`${this.apiUrl}/summary`)
      .pipe(
        tap((response) => {
          this.summary.set(response);

          this.loading.set(false);
        }),
      );
  }
}