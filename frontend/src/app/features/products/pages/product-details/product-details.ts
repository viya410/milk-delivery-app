import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../../core/services/product';
import { CartService } from '../../../../core/services/cart';
import { MotionService } from '../../../../core/services/motion';
import { Product, ProductSize } from '../../models/product';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly motion = inject(MotionService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  @ViewChild('detailImage') detailImage?: ElementRef<HTMLElement>;
  @ViewChild('detailInfo') detailInfo?: ElementRef<HTMLElement>;

  readonly product = signal<Product | null>(null);
  readonly loading = signal(true);
  readonly adding = signal(false);
  readonly errorMessage = signal('');
  readonly addError = signal('');
  readonly successMessage = signal('');
  readonly selectedSize = signal<ProductSize | null>(null);

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(id) || id <= 0) {
      this.errorMessage.set('This product link is invalid.');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.productService.getProductById(id).subscribe({
      next: (response: Product) => {
        this.product.set(response);
        this.selectedSize.set(response.sizes?.[0] ?? null);
        this.loading.set(false);
        this.changeDetector.detectChanges();
        this.motion.animateEntrance([
          this.detailImage?.nativeElement,
          this.detailInfo?.nativeElement,
        ].filter((element): element is HTMLElement => !!element));
      },
      error: () => {
        this.errorMessage.set('We could not load this product. Please try again.');
        this.loading.set(false);
      },
    });
  }

  selectSize(size: ProductSize): void {
    this.selectedSize.set(size);
    this.successMessage.set('');
    this.addError.set('');
  }

  getDisplayPrice(): number {
    const product = this.product();
    if (!product) return 0;
    return this.selectedSize()?.price ?? product.price;
  }

  getDisplayUnit(): string {
    return this.selectedSize()?.size ?? this.product()?.unit ?? '';
  }

  addToCart(): void {
    const currentProduct = this.product();
    if (!currentProduct || this.adding()) return;

    this.adding.set(true);
    this.addError.set('');
    this.successMessage.set('');

    this.cartService.addToCart({
      productId: currentProduct.id,
      quantity: 1,
      ...(this.selectedSize()?.id ? { productSizeId: this.selectedSize()!.id } : {}),
    }).subscribe({
      next: () => {
        this.adding.set(false);
        this.successMessage.set(`${currentProduct.name} added to your cart.`);
      },
      error: () => {
        this.adding.set(false);
        this.addError.set('We could not add this item. Please try again.');
      },
    });
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }
}
