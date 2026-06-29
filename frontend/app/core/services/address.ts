import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/address';

  saveAddress(address: any) {
    return this.http.post(this.apiUrl, address);
  }

  getAddress() {
    return this.http.get(this.apiUrl);
  }

  deleteAddress(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getAddresses() {
    return this.http.get<any[]>(this.apiUrl);
  }
}
