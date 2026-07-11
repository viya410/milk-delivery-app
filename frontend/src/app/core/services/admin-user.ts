import { Injectable, inject, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { AdminUser } from '../models/admin-user.model';
import { SubscriptionResponse } from '../models/subscription-response.model';

@Injectable({
  providedIn: 'root',
})
export class AdminUserService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/admin/users`;

  readonly users = signal<AdminUser[]>([]);

  readonly loading = signal(false);

  loadUsers() {
    this.loading.set(true);

    return this.http

      .get<AdminUser[]>(this.apiUrl)

      .pipe(
        tap((users) => {
          this.users.set(users);

          this.loading.set(false);
        }),
      );
  }

  addUsers(users: AdminUser[]): void {
    this.users.set(users);
  }

  updateUser(user: AdminUser) {
    return this.http

      .put<AdminUser>(
        `${this.apiUrl}/${user.id}`,

        user,
      )

      .pipe(
        tap((updated) => {
          this.users.update((users) =>
            users.map((existing) =>
              existing.id === updated.id
                ? {
                    ...existing,

                    ...updated,
                  }
                : existing,
            ),
          );
        }),
      );
  }

  deleteUser(id: number) {
    return this.http

      .delete(`${this.apiUrl}/${id}`)

      .pipe(
        tap(() => {
          this.users.update((users) => users.filter((user) => user.id !== id));
        }),
      );
  }

  getUserSubscriptions(userId: number) {
    return this.http.get<SubscriptionResponse[]>(`${this.apiUrl}/${userId}/subscriptions`);
  }
}
