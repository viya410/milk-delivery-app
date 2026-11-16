import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ProductService } from '../../../../core/services/product';
import { Product } from '../../models/product';

import { ProductCardComponent } from '../../../../shared/ui/product-card/product-card';
import { CartService } from '../../../../core/services/cart';
import { AuthService } from '../../../../core/services/auth';

import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ProductSizeSheet } from '../../../../shared/ui/product-size-sheet/product-size-sheet';
import { ProductSize } from '../../models/product';
import { MotionService } from '../../../../core/services/motion';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit, AfterViewInit, OnDestroy {
  private readonly productService = inject(ProductService);

  private readonly router = inject(Router);

  private readonly bottomSheet = inject(MatBottomSheet);

  readonly cartService = inject(CartService);

  private readonly authService = inject(AuthService);

  private readonly motion = inject(MotionService);

  @ViewChildren('productTile', { read: ElementRef })
  private productTiles!: QueryList<ElementRef<HTMLElement>>;

  private tileChanges?: Subscription;

  readonly allProducts = signal<Product[]>([]);

  readonly filteredProducts = signal<Product[]>([]);

  readonly searchText = signal('');

  readonly loading = signal(true);

  readonly errorMessage = signal('');

  ngAfterViewInit(): void {
    this.tileChanges = this.productTiles.changes.subscribe((tiles: QueryList<ElementRef<HTMLElement>>) => {
      this.motion.animateEntrance(tiles.toArray().map((tile) => tile.nativeElement));
    });
  }

  ngOnDestroy(): void {
    this.tileChanges?.unsubscribe();
  }

  ngOnInit(): void {
    this.cartService.loadCart();
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.productService.getProducts().subscribe({
      next: (response: Product[]) => {
        this.allProducts.set(response);

        this.filteredProducts.set(response);
        this.loading.set(false);
      },

      error: (error) => {
        console.error(error);

        this.errorMessage.set('Unable to load products. Please check your connection and try again.');

        this.loading.set(false);
      },
    });
  }

  clearSearch(): void {
    this.searchText.set('');
    this.filteredProducts.set(this.allProducts());
  }

  search(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();

    this.searchText.set(value);

    if (!value) {
      this.filteredProducts.set(this.allProducts());

      return;
    }

    this.filteredProducts.set(
      this.allProducts().filter(
        (product) =>
          product.name.toLowerCase().includes(value) ||
          product.description.toLowerCase().includes(value) ||
          product.unit.toLowerCase().includes(value),
      ),
    );
  }

  addToCart(productId: number): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);

      return;
    }

    const product = this.allProducts().find((x) => x.id === productId);

    if (!product) {
      return;
    }

    if (product.sizes?.length) {
      this.bottomSheet
        .open(ProductSizeSheet, {
          data: product,
        })
        .afterDismissed()
        .subscribe((size: ProductSize) => {
          if (!size) {
            return;
          }

          this.cartService
            .addToCart({
              productId,

              productSizeId: size.id,

              quantity: 1,
            })
            .subscribe();
        });

      return;
    }

    this.cartService
      .addToCart({
        productId,

        quantity: 1,
      })
      .subscribe();
  }

  increase(productId: number): void {
    const item = this.cartService.getCartItem(productId);

    if (!item) {
      return;
    }

    this.cartService.increaseQuantity(item.id).subscribe({
      next: () => this.cartService.loadCart(),
    });
  }

  decrease(productId: number): void {
    const item = this.cartService.getCartItem(productId);

    if (!item) {
      return;
    }

    const request =
      item.quantity === 1
        ? this.cartService.removeItem(item.id)
        : this.cartService.decreaseQuantity(item.id);

    request.subscribe({
      next: () => this.cartService.loadCart(),
    });
  }

  viewProduct(productId: number): void {
    this.router.navigate(['/products', productId]);
  }
}
