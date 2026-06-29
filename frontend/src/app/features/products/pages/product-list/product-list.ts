import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ProductService } from '../../../../core/services/product';
import { CartService } from '../../../../core/services/cart';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList implements OnInit {

  private productService =
    inject(ProductService);

  private cartService =
    inject(CartService);

  private router =
    inject(Router);

  private authService = inject(AuthService);

  products = signal<any[]>([]);

  loading = signal(true);

  errorMessage = signal('');

  ngOnInit(): void {

    this.productService
      .getProducts()
      .subscribe({

        next: (response) => {

          console.log('Products Loaded', response);

          this.products.set(response);

          this.loading.set(false);
        },

        error: (error) => {

          console.error(error);

          this.errorMessage.set(
            'Unable to load products'
          );

          this.loading.set(false);
        }
      });
  }

  viewProduct(
    productId: number
  ): void {

    if (!productId) {

      return;
    }

    this.router.navigate([
      '/products',
      productId
    ]);
  }

  trackByProductId(
    index: number,
    product: any
  ): number {

    return product.id;
  }

addToCart(
  productId: number
): void {

  let isLoggedIn!: Boolean;
  isLoggedIn = this.authService.isLoggedIn();

  if (!isLoggedIn) {

    this.router.navigate([
      '/auth/login'
    ]);

    return;
  }

  this.cartService
    .addToCart({

      productId,

      quantity: 1

    })
    .subscribe({

      next: () => {

        this.router.navigate([
          '/cart'
        ]);

      },

      error: error => {

        console.error(
          error
        );

      }

    });

}
}