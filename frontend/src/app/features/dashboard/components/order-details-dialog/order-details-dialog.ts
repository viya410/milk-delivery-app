import { Component, inject } from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogModule
} from '@angular/material/dialog';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule
  ],
  templateUrl: './order-details-dialog.html',
  styleUrl: './order-details-dialog.scss'
})
export class OrderDetailsDialog {

  data = inject(MAT_DIALOG_DATA);

}