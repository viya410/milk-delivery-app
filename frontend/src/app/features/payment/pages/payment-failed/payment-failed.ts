import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment-failed',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './payment-failed.html',
  styleUrl: './payment-failed.scss',
})
export class PaymentFailed {}
