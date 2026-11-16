import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { DeliveryPartnerDashboard } from '../models/delivery-partner-dashboard';
import { OrderResponse } from '../models/order-response';

@Injectable({
  providedIn: 'root',
})
export class DeliveryPartnerService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/delivery-partner`;

  getDashboard(): Observable<DeliveryPartnerDashboard> {
    return this.http.get<DeliveryPartnerDashboard>(`${this.apiUrl}/dashboard`);
  }

  getAvailableOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.apiUrl}/orders/available`);
  }

  getMyOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.apiUrl}/orders/my`);
  }

  pickOrder(orderId: number): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.apiUrl}/orders/${orderId}/pick`, {});
  }

  verifyDeliveryOtp(orderId: number, otp: string): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(
      `${this.apiUrl}/orders/${orderId}/verify-otp`,
      { otp }
    );
  }
}
