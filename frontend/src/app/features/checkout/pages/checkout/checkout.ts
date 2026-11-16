import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductCategory } from '../../../products/models/product';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
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
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class Checkout implements OnInit {
  private readonly addressService = inject(AddressService);
  private readonly orderService = inject(OrderService);
  private readonly paymentService = inject(PaymentService);
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly dashboardService = inject(DashboardService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  readonly currentUser = this.authService.user();
  readonly cartItems = signal<any[]>([]);
  readonly addresses = this.addressService.addresses;
  readonly loadingAddresses = this.addressService.loading;
  readonly selectedAddress = signal<any | null>(null);
  readonly isPlacingOrder = signal(false);
  readonly errorMessage = signal('');
  readonly addressError = signal('');
  readonly categoryOrder: ProductCategory[] = ['DAIRY', 'POULTRY', 'VEGETABLES'];

  ngOnInit(): void {
    this.loadAddresses();
    this.loadCart();
  }

  private loadAddresses(): void {
    this.addressError.set('');
    this.addressService.getAddresses().subscribe({
      next: (addresses) => {
        if (addresses.length && !this.selectedAddress()) {
          this.selectedAddress.set(addresses[0]);
        }
      },
      error: () => this.addressError.set('Unable to load saved addresses. Please try again.')
    });
  }

  private loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (cart) => this.cartItems.set(cart),
      error: () => this.errorMessage.set('Unable to load your cart. Please return to your cart and try again.')
    });
  }

  selectAddress(address: any): void {
    this.selectedAddress.set(address);
  }

  addNewAddress(): void {
    const dialogRef = this.dialog.open(AddressDialog, {
      width: '550px',
      maxWidth: '95vw'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.addressService.saveAddress(result).subscribe({
        next: () => {
          const latest = this.addresses()[this.addresses().length - 1];
          if (latest) this.selectedAddress.set(latest);
          this.addressError.set('');
        },
        error: () => this.addressError.set('We could not save that address. Please try again.')
      });
    });
  }

  categoryLabel(category: ProductCategory): string {
    return category === 'POULTRY' ? 'Poultry' : category === 'VEGETABLES' ? 'Vegetables' : 'Dairy';
  }

  categoryItems(category: ProductCategory): any[] {
    return this.cartItems().filter((item) => (item.category || 'DAIRY') === category);
  }

  categoryTotal(category: ProductCategory): number {
    return this.categoryItems(category).reduce((total, item) => total + item.price * item.quantity, 0);
  }

  getTotal(): number {
    return this.cartItems().reduce((total, item) => total + item.price * item.quantity, 0);
  }

  getItemCount(): number {
    return this.cartItems().reduce((total, item) => total + item.quantity, 0);
  }

  placeOrder(): void {
    if (this.isPlacingOrder()) return;
    this.errorMessage.set('');

    if (!this.cartItems().length) {
      this.errorMessage.set('Your cart is empty. Add some products before checkout.');
      return;
    }
    if (!this.selectedAddress()) {
      this.errorMessage.set('Please select a delivery address to continue.');
      return;
    }

    this.isPlacingOrder.set(true);
    if (!environment.enablePayment) {
      this.placeActualOrder();
      return;
    }
    this.openPayment(this.getTotal());
  }

  openPayment(amount: number): void {
    this.paymentService.createOrder(amount).subscribe({
      next: (order) => {
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
          theme: { color: '#2e7d32' },
          modal: {
            ondismiss: () => {
              this.isPlacingOrder.set(false);
              this.router.navigate(['/payment-failed']);
            }
          },
          handler: (response: any) => this.verifyPayment(response, amount)
        };
        new Razorpay(options).open();
      },
      error: () => {
        this.isPlacingOrder.set(false);
        this.errorMessage.set('Payment could not be started. Please try again.');
      }
    });
  }

  private verifyPayment(response: any, amount: number): void {
    this.paymentService.verifyPayment({
      razorpayOrderId: response.razorpay_order_id,
      razorpayPaymentId: response.razorpay_payment_id,
      razorpaySignature: response.razorpay_signature
    }).subscribe({
      next: (verified) => {
        if (!verified) {
          this.isPlacingOrder.set(false);
          this.errorMessage.set('Payment verification failed. Please try again or contact support.');
          return;
        }
        this.paymentService.savePayment({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          amount
        }).subscribe({
          next: () => this.placeActualOrder(),
          error: () => {
            this.isPlacingOrder.set(false);
            this.errorMessage.set('Payment was verified, but we could not record it. Please contact support before trying again.');
          }
        });
      },
      error: () => {
        this.isPlacingOrder.set(false);
        this.errorMessage.set('We could not verify your payment. Please contact support if money was deducted.');
      }
    });
  }

  private placeActualOrder(): void {
    this.orderService.placeOrder(this.selectedAddress().id).subscribe({
      next: () => {
        this.dashboardService.refreshSummary();
        this.orderService.refreshOrders();
        this.cartService.clearCart().subscribe({
          next: () => this.router.navigate(['/order-success']),
          error: () => this.router.navigate(['/order-success'])
        });
      },
      error: (error) => {
        this.isPlacingOrder.set(false);
        const message = error?.error?.message;
        this.errorMessage.set(typeof message === 'string' && message.trim()
          ? message
          : 'We could not place your order. Your cart is still available; please try again.');
      }
    });
  }
}
