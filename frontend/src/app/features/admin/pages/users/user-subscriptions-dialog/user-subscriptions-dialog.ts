import { Component, Inject, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AdminUserService } from '../../../../../core/services/admin-user';
import { SubscriptionResponse } from '../../../../../core/models/subscription-response.model';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-user-subscriptions-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  templateUrl: './user-subscriptions-dialog.html',
  styleUrls: ['./user-subscriptions-dialog.scss'],
})
export class UserSubscriptionsDialog implements OnInit {

  private adminUserService = inject(AdminUserService);

  readonly loading = signal(true);

  readonly subscriptions = signal<SubscriptionResponse[]>([]);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public userId: number,
  ) {}

  ngOnInit(): void {

    this.adminUserService
      .getUserSubscriptions(this.userId)
      .subscribe({

        next: response => {

          this.subscriptions.set(response);

          this.loading.set(false);

        },

        error: () => {

          this.loading.set(false);

        }

      });

  }

}