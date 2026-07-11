import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../core/services/product';
import { CartService } from '../../../../core/services/cart';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private router = inject(Router);

  product = signal<any | null>(null);
  loading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Product Id:', id);
    if (Number.isNaN(id)) {
      this.errorMessage.set('Invalid Product Id');
      this.loading.set(false);
      return;
    }
    this.productService.getProductById(id).subscribe({
      next: (response) => {
        console.log('Product Loaded:', response);
        this.product.set(response);
        this.loading.set(false);
      },
      error: (error) => {
        console.error(error);
        this.errorMessage.set('Unable to load product');
        this.loading.set(false);
      },
    });
  }
  addToCart(): void {
    const currentProduct = this.product();

    if (!currentProduct) {
      return;
    }

    this.cartService
      .addToCart({
        productId: currentProduct.id,

        quantity: 1,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/cart']);
        },

        error: (error) => {
          console.error(error);
        },
      });
  }

  // imageError(event: Event): void {
  //   (event.target as HTMLImageElement).src = 'assets/images/products/no-image.png';
  // }

  getDisplayPrice(): number {

  const product = this.product();

  if (!product) {
    return 0;
  }

  return product.sizes?.length
    ? product.sizes[0].price
    : product.price;

}
}
