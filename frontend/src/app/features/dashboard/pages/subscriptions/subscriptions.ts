import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { SubscriptionService } from '../../../../core/services/subscription';
import { SubscriptionDialog } from '../../components/subscription-dialog/subscription-dialog';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './subscriptions.html',
  styleUrl: './subscriptions.scss'
})
export class Subscriptions implements OnInit {

  private dialog = inject(MatDialog);

  readonly subscriptionService = inject(SubscriptionService);

  readonly subscriptions = computed(() =>
    this.subscriptionService.subscriptions()
  );

  readonly loading = computed(() =>
    this.subscriptionService.loading()
  );

  ngOnInit(): void {

    this.subscriptionService
      .loadSubscriptions()
      .subscribe();

  }

  pause(id: number): void {

    this.subscriptionService
      .updateStatus(id, 'PAUSED')
      .subscribe();

  }

  resume(id: number): void {

    this.subscriptionService
      .updateStatus(id, 'ACTIVE')
      .subscribe();

  }

  cancel(id: number): void {

    this.subscriptionService
      .updateStatus(id, 'CANCELLED')
      .subscribe();

  }

  createSubscription(): void {

    this.dialog
      .open(SubscriptionDialog, {
        width: '550px',
        disableClose: true
      })
      .afterClosed()
      .subscribe(result => {

        if (!result) {
          return;
        }

        this.subscriptionService
          .createSubscription(result)
          .subscribe();

      });

  }

}