import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../../core/services/auth';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { EditProfileDialog } from '../../components/edit-profile-dialog/edit-profile-dialog';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);

  user = this.authService.user;

  accountInfo = {
    joinedDate: 'January 2025',

    subscriptionPlan: 'Daily Milk Plan',

    status: 'Active',
  };

  openEditProfile(): void {
    const dialogRef = this.dialog.open(EditProfileDialog, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.user = {
          ...this.user,
          ...result,
        };

        console.log('Updated Profile:', this.user);
      }
    });
  }
}
