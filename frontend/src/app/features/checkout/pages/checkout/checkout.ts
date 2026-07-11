import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AddressService } from '../../../../core/services/address';
import { OrderService } from '../../../../core/services/order';
import { PaymentService } from '../../../../core/services/payment';
import { CartService } from '../../../../core/services/cart';
import { AuthService } from '../../../../core/services/auth';
import { DashboardService } from '../../../../core/services/dashboard';

import { AddressDialog } from '../../../dashboard/components/address-dialog/address-dialog';

import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class Checkout implements OnInit {

  private addressService = inject(AddressService);

  private orderService = inject(OrderService);

  private paymentService = inject(PaymentService);

  private cartService = inject(CartService);

  private authService = inject(AuthService);

  private dashboardService = inject(DashboardService);

  private router = inject(Router);

  private dialog = inject(MatDialog);

  currentUser = this.authService.user();

  cartItems = signal<any[]>([]);

  // Consume AddressService signals directly
  readonly addresses = this.addressService.addresses;

  readonly loadingAddresses = this.addressService.loading;

  selectedAddress = signal<any | null>(null);

  ngOnInit(): void {

    this.loadAddresses();

    this.loadCart();

  }

  private loadAddresses(): void {

    this.addressService
      .getAddresses()
      .subscribe({

        next: addresses => {

          if (

            addresses.length > 0 &&

            !this.selectedAddress()

          ) {

            this.selectedAddress.set(addresses[0]);

          }

        },

        error: error => {

          console.error(error);

        }

      });

  }

  private loadCart(): void {

    this.cartService
      .getCart()
      .subscribe({

        next: cart => {

          this.cartItems.set(cart);

        },

        error: error => {

          console.error(error);

        }

      });

  }

  selectAddress(

    address: any

  ): void {

    this.selectedAddress.set(address);

  }

  addNewAddress(): void {

    const dialogRef = this.dialog.open(

      AddressDialog,

      {

        width: '550px'

      }

    );

    dialogRef.afterClosed()

      .subscribe(result => {

        if (!result) {

          return;

        }

        this.addressService

          .saveAddress(result)

          .subscribe({

            next: () => {

              const latest =

                this.addresses()[

                  this.addresses().length - 1

                ];

              if (latest) {

                this.selectedAddress.set(latest);

              }

            },

            error: error => {

              console.error(error);

            }

          });

      });

  }

  placeOrder(): void {

    if (!this.selectedAddress()) {

      alert('Please select a delivery address.');

      return;

    }

    if (!environment.enablePayment) {

      this.placeActualOrder();

      return;

    }

    this.openPayment(

      this.getTotal()

    );

  }

  openPayment(

    amount: number

  ): void {

    this.paymentService
      .createOrder(amount)
      .subscribe({

        next: order => {

          const options = {

            key: environment.razorpayKey,

            amount: order.amount,

            currency: order.currency,

            name: 'Fresh Farm Milk',

            description: 'Milk Order',

            order_id: order.id,

            prefill: {

              name: this.currentUser?.fullName,

              email: this.currentUser?.email,

              contact: this.currentUser?.phoneNumber

            },

            theme: {

              color: '#2e7d32'

            },

            modal: {

              ondismiss: () => {

                this.router.navigate([

                  '/payment-failed'

                ]);

              }

            },

            handler: (response: any) => {

              this.verifyPayment(

                response,

                amount

              );

            }

          };

          new Razorpay(options).open();

        }

      });

  }

  private verifyPayment(

    response: any,

    amount: number

  ): void {

    this.paymentService

      .verifyPayment({

        razorpayOrderId: response.razorpay_order_id,

        razorpayPaymentId: response.razorpay_payment_id,

        razorpaySignature: response.razorpay_signature

      })

      .subscribe({

        next: verified => {

          if (!verified) {

            alert('Payment verification failed.');

            return;

          }

          this.paymentService

            .savePayment({

              razorpayOrderId: response.razorpay_order_id,

              razorpayPaymentId: response.razorpay_payment_id,

              amount

            })

            .subscribe({

              next: () => {

                this.placeActualOrder();

              }

            });

        },

        error: error => {

          console.error(error);

        }

      });

  }

  private placeActualOrder(): void {

    this.orderService

      .placeOrder(

        this.selectedAddress().id

      )

      .subscribe({

        next: () => {

          this.cartService

            .clearCart()

            .subscribe({

              next: () => {

                this.dashboardService.refreshSummary();

                this.orderService.refreshOrders();

                this.router.navigate([

                  '/order-success'

                ]);

              },

              error: error => {

                console.error(error);

              }

            });

        },

        error: error => {

          console.error(error);

        }

      });

  }

  getTotal(): number {

    return this.cartItems().reduce(

      (

        total,

        item

      ) =>

        total +

        item.price *

        item.quantity,

      0

    );

  }

}