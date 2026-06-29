import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddressService } from '../../../../core/services/address';
import { OrderService } from '../../../../core/services/order';
import { PaymentService } from '../../../../core/services/payment';
import { CartService } from '../../../../core/services/cart';
import { AuthService } from '../../../../core/services/auth';
import { environment } from '../../../../../environments/environment';
import { DashboardService } from '../../../../core/services/dashboard';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout implements OnInit {
  private fb = inject(FormBuilder);
  private addressService = inject(AddressService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private paymentService = inject(PaymentService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private dashboardService = inject(DashboardService);

  cartItems = signal<any[]>([]);

  private currentUser = this.authService.user();

  checkoutForm = this.fb.nonNullable.group({
    customerName: [this.currentUser?.fullName ?? '', Validators.required],
    mobileNumber: [this.currentUser?.phoneNumber ?? '', Validators.required],
    houseNo: ['', Validators.required],
    street: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    pincode: ['', Validators.required],
  });

  ngOnInit(): void {
    this.cartService.getCart().subscribe({
      next: (response) => {
        console.log('Cart Items:', response);
        this.cartItems.set(response);
      },
    });
    const user = this.authService.user();

    if (user) {
      this.checkoutForm.patchValue({
        customerName: user.fullName,
        mobileNumber: user.phoneNumber,
      });
    }
  }

  placeOrder(): void {
    if (!environment.enablePayment) {
      this.placeActualOrder();
      return;
    }

    const amount = this.getTotal();
    console.log('Payment amount:', amount);
    this.openPayment(amount);
  }

  openPayment(amount: number): void {
    this.paymentService.createOrder(amount).subscribe({
      next: (order) => {
        const options = {
          modal: {
            ondismiss: () => {
              this.router.navigate(['/payment-failed']);
            },
          },

          key: environment.razorpayKey,
          amount: order.amount,
          currency: order.currency,
          name: 'Fresh Farm Milk',
          description: 'Milk Order',
          order_id: order.id,

          handler: (response: any) => {
            console.log('Payment Success', response);

            this.paymentService
              .verifyPayment({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              })
              .subscribe({
                next: (verified) => {
                  if (verified) {
                    this.paymentService
                      .savePayment({
                        razorpayOrderId: response.razorpay_order_id,
                        razorpayPaymentId: response.razorpay_payment_id,
                        amount: amount,
                      })
                      .subscribe({
                        next: () => {
                          this.placeActualOrder();
                        },
                      });
                  } else {
                    alert('Payment verification failed');
                  }
                },

                error: (error) => {
                  console.error(error);
                },
              });
          },

          prefill: {
            name: this.checkoutForm.getRawValue().customerName,
            contact: this.checkoutForm.getRawValue().mobileNumber,
            email: this.currentUser?.email ?? '',
          },

          theme: {
            color: '#2e7d32',
          },
        };

        const razorpay = new Razorpay(options);
        razorpay.open();
      },
    });
  }

  placeActualOrder(): void {
    const address = this.checkoutForm.getRawValue();

    this.addressService.saveAddress(address).subscribe({
      next: () => {
        this.orderService.placeOrder().subscribe({
          next: () => {
            this.cartService.clearCart().subscribe({
              next: () => {
                // Refresh shared state
                this.dashboardService.refreshSummary();

                this.orderService.refreshOrders();

                this.router.navigate(['/order-success']);
              },

              error: (error) => {
                console.error(error);
              },
            });
          },

          error: (error) => {
            console.error(error);
          },
        });
      },

      error: (error) => {
        console.error(error);
      },
    });
  }

  getTotal(): number {
    return this.cartItems().reduce(
      (total, item) => total + item.price * item.quantity,

      0,
    );
  }
}
