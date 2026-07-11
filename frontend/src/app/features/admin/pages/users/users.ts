import { Component, OnInit, inject, signal, computed } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AdminUserService } from '../../../../core/services/admin-user';

import { AdminUser } from '../../../../core/models/admin-user.model';

import { UserDialog } from './user-dialog/user-dialog';
import { UserSubscriptionsDialog } from './user-subscriptions-dialog/user-subscriptions-dialog';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
  readonly userService = inject(AdminUserService);

  private dialog = inject(MatDialog);

  private snackBar = inject(MatSnackBar);

  readonly displayedColumns = [
    'name',

    'email',

    'phone',

    'subscriptions',

    'orders',

    'addresses',

    'role',

    'actions',
  ];

  readonly searchText = signal('');

  readonly selectedFilter = signal('ALL');

  readonly filteredUsers = computed(() => {
    let users = this.userService.users();
    console.log('Filtered Users:', users); // Debugging line to check the users array

    const filter = this.selectedFilter();

    const search = this.searchText()

      .trim()

      .toLowerCase();

    if (filter === 'ADMIN') {
      users = users.filter((user) => user.role === 'ROLE_ADMIN');
    }

    if (filter === 'CUSTOMER') {
      users = users.filter((user) => user.role !== 'ROLE_ADMIN');
    }

    if (!search) {
      return users;
    }

    return users.filter(
      (user) =>
        user.fullName

          .toLowerCase()

          .includes(search) ||
        user.email

          .toLowerCase()

          .includes(search) ||
        user.phoneNumber.includes(search),
    );
  });

  readonly totalUsers = computed(() => this.userService.users().length);

  readonly adminCount = computed(
    () =>
      this.userService
        .users()

        .filter((user) => user.role === 'ROLE_ADMIN').length,
  );

  readonly customerCount = computed(
    () =>
      this.userService
        .users()

        .filter((user) => user.role !== 'ROLE_ADMIN').length,
  );

  ngOnInit(): void {
    this.userService

      .loadUsers()

      .subscribe();
  }

  changeFilter(filter: string): void {
    this.selectedFilter.set(filter);
  }

  updateSearch(value: string): void {
    this.searchText.set(value);
  }

  getRoleLabel(role: string): string {
    return role === 'ROLE_ADMIN' ? 'Admin' : 'Customer';
  }

  getRoleClass(role: string): string {
    return role === 'ROLE_ADMIN' ? 'admin-role' : 'customer-role';
  }

  getInitials(name?: string): string {
    if (!name) {
      return '?';
    }

    return name

      .trim()

      .split(' ')

      .map((part) => part[0])

      .join('')

      .substring(0, 2)

      .toUpperCase();
  }

  editUser(user: AdminUser): void {
    const dialogRef = this.dialog.open(
      UserDialog,

      {
        width: '600px',

        data: user,
      },
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      this.userService

        .updateUser(result)

        .subscribe({
          next: () => {
            this.snackBar.open(
              'User updated successfully.',

              'Close',

              {
                duration: 2500,

                horizontalPosition: 'right',

                verticalPosition: 'top',
              },
            );
          },

          error: () => {
            this.snackBar.open(
              'Failed to update user.',

              'Close',

              {
                duration: 2500,

                horizontalPosition: 'right',

                verticalPosition: 'top',
              },
            );
          },
        });
    });
  }

  deleteUser(id: number): void {
    if (!confirm('Delete this user?')) {
      return;
    }

    this.userService

      .deleteUser(id)

      .subscribe({
        next: () => {
          this.snackBar.open(
            'User deleted successfully.',

            'Close',

            {
              duration: 2500,

              horizontalPosition: 'right',

              verticalPosition: 'top',
            },
          );
        },

        error: () => {
          this.snackBar.open(
            'Failed to delete user.',

            'Close',

            {
              duration: 2500,

              horizontalPosition: 'right',

              verticalPosition: 'top',
            },
          );
        },
      });
  }

  viewSubscriptions(user: AdminUser) {
    this.dialog.open(
      UserSubscriptionsDialog,

      {
        width: '700px',

        data: user.id,
      },
    );
  }
}
