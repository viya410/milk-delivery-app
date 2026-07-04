import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { Address } from '../models/address.model';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/api/address';

  readonly addresses = signal<Address[]>([]);

  readonly loading = signal(false);

  saveAddress(address: Address) {

    return this.http
      .post<Address>(this.apiUrl, address)
      .pipe(
        tap(() => this.refreshAddresses())
      );

  }

  getAddresses() {

    this.loading.set(true);

    return this.http
      .get<Address[]>(this.apiUrl)
      .pipe(
        tap(addresses => {
          this.addresses.set(addresses);
          this.loading.set(false);
        })
      );

  }

  refreshAddresses(): void {

    this.getAddresses().subscribe();

  }

  deleteAddress(id: number) {

    return this.http
      .delete(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => this.refreshAddresses())
      );

  }

}