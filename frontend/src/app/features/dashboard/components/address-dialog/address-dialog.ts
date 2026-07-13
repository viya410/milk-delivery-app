import { Component, inject, signal } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { HttpClient } from '@angular/common/http';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import { MatButtonModule } from '@angular/material/button';

import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-address-dialog',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],

  templateUrl: './address-dialog.html',

  styleUrl: './address-dialog.scss',
})
export class AddressDialog {
  private fb = inject(FormBuilder);

  private http = inject(HttpClient);

  private authService = inject(AuthService);

  readonly dialogRef = inject(MatDialogRef<AddressDialog>);

  readonly data = inject(MAT_DIALOG_DATA, {
    optional: true,
  });

  readonly isEdit = !!this.data;

  readonly currentUser = this.authService.user();

  readonly locating = signal(false);

  readonly locationError = signal('');

  readonly locationSuccess = signal(false);

  readonly addressForm = this.fb.nonNullable.group({
    customerName: [
      this.data?.customerName ?? this.currentUser?.fullName ?? '',

      Validators.required,
    ],

    mobileNumber: [
      this.data?.mobileNumber ?? this.currentUser?.phoneNumber ?? '',

      [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)],
    ],

    houseNo: [this.data?.houseNo ?? '', Validators.required],

    street: [this.data?.street ?? '', Validators.required],

    city: [this.data?.city ?? '', Validators.required],

    state: [this.data?.state ?? '', Validators.required],

    pincode: [this.data?.pincode ?? '', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  useCurrentLocation(): void {
    this.locationError.set('');

    this.locationSuccess.set(false);

    if (!navigator.geolocation) {
      this.locationError.set('Location is not supported by this browser.');

      return;
    }

    this.locating.set(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;

        const longitude = position.coords.longitude;

        this.reverseGeocode(latitude, longitude);
      },

      (error) => {
        this.locating.set(false);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            this.locationError.set(
              'Location permission was denied. Please allow location access and try again.',
            );

            break;

          case error.POSITION_UNAVAILABLE:
            this.locationError.set('Your current location is unavailable.');

            break;

          case error.TIMEOUT:
            this.locationError.set('Location request timed out. Please try again.');

            break;

          default:
            this.locationError.set('Unable to get your current location.');
        }
      },

      {
        enableHighAccuracy: true,

        timeout: 15000,

        maximumAge: 0,
      },
    );
  }

  private reverseGeocode(
    latitude: number,

    longitude: number,
  ): void {
    const url = 'https://nominatim.openstreetmap.org/reverse';

    this.http

      .get<any>(url, {
        params: {
          format: 'jsonv2',

          lat: latitude.toString(),

          lon: longitude.toString(),

          addressdetails: '1',
        },
      })

      .subscribe({
        next: (response) => {
          const address = response.address ?? {};

          const street =
            address.road ||
            address.neighbourhood ||
            address.suburb ||
            address.residential ||
            address.village ||
            '';

          const city =
            address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            address.county ||
            '';

          const state = address.state || '';

          const pincode = address.postcode || '';

          this.addressForm.patchValue({
            street,

            city,

            state,

            pincode,
          });

          this.locating.set(false);

          this.locationSuccess.set(true);
        },

        error: (error) => {
          console.error('Reverse geocoding failed:', error);

          this.locating.set(false);

          this.locationError.set(
            'Location found, but the address could not be detected. Please enter it manually.',
          );
        },
      });
  }

  save(): void {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();

      return;
    }

    this.dialogRef.close(this.addressForm.getRawValue());
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
