import { Component, computed, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { AddressDialog } from '../../components/address-dialog/address-dialog';
import { AddressService } from '../../../../core/services/address';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './addresses.html',
  styleUrl: './addresses.scss',
})
export class Addresses implements OnInit {
  private dialog = inject(MatDialog);

  private addressService = inject(AddressService);

  addresses = computed(() => this.addressService.addresses());

  loading = computed(() => this.addressService.loading());

  ngOnInit(): void {
    this.addressService.getAddresses().subscribe();
  }

  addAddress(): void {
    const dialogRef = this.dialog.open(AddressDialog, {
      width: '500px',
      maxWidth: 'calc(100vw - 24px)',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addressService.saveAddress(result).subscribe();
      }
    });
  }

  editAddress(address: any): void {
    this.dialog.open(AddressDialog, {
      width: '500px',
      maxWidth: 'calc(100vw - 24px)',
      data: address,
    });
  }

  deleteAddress(address: any): void {
    this.addressService.deleteAddress(address.id).subscribe();
  }
}
