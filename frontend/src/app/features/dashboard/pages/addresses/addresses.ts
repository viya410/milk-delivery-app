import { Component, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import {
  AddressDialog
} from '../../components/address-dialog/address-dialog';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [
    CommonModule,

    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './addresses.html',
  styleUrl: './addresses.scss'
})
export class Addresses {

  private dialog = inject(MatDialog);

  addresses = [
    {
      type: 'Home',
      name: 'Vishnu',
      addressLine: 'Flat 101, Green Residency',
      city: 'Hyderabad',
      default: true
    },
    {
      type: 'Office',
      name: 'Vishnu',
      addressLine: 'Hitech City',
      city: 'Hyderabad',
      default: false
    }
  ];

  addAddress(): void {

    const dialogRef =
      this.dialog.open(
        AddressDialog,
        {
          width: '500px'
        }
      );

    dialogRef.afterClosed()
      .subscribe(result => {

        if (result) {

          this.addresses.push({
            ...result,
            default: false
          });

        }

      });

  }

  editAddress(
    address: any,
    index: number
  ): void {

    const dialogRef =
      this.dialog.open(
        AddressDialog,
        {
          width: '500px',
          data: address
        }
      );

    dialogRef.afterClosed()
      .subscribe(result => {

        if (result) {

          this.addresses[index] = {
            ...this.addresses[index],
            ...result
          };

          this.addresses =
            [...this.addresses];

        }

      });

  }

  deleteAddress(
    index: number
  ): void {

    this.addresses.splice(
      index,
      1
    );

    this.addresses =
      [...this.addresses];

  }
}