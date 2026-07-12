import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/payment`;

  createOrder(amount: number) {
    return this.http.post<any>(`${this.apiUrl}/create-order`, {
      amount,
    });
  }
  verifyPayment(paymentData: any) {
    return this.http.post<boolean>(`${this.apiUrl}/verify`, paymentData);
  }
  savePayment(payment: any) {
    return this.http.post(
      this.apiUrl,

      payment,
    );
  }

  getPayments() {
    return this.http.get<any[]>(this.apiUrl);
  }
}
