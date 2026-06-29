import { Component, OnInit, inject, signal } from '@angular/core';
import { PaymentService } from '../../../../core/services/payment';

@Component({
  selector: 'app-payment-history',
  imports: [],
  templateUrl: './payment-history.html',
  styleUrl: './payment-history.scss',
})
export class PaymentHistory implements OnInit {
  private paymentService = inject(PaymentService);

  payments = signal<any[]>([]);

  ngOnInit(): void {
    this.paymentService
      .getPayments()

      .subscribe({
        next: (response) => {
          this.payments.set(response);
        },
      });
  }
}

