import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductService } from '../../../../core/services/product';
import { Product, ProductCategory } from '../../models/product';
import { FarmCategoryService } from '../../../../core/services/farm-category';

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

  readonly farmCategory = inject(FarmCategoryService);



  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly bottomSheet = inject(MatBottomSheet);
  readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly motion = inject(MotionService);

  @ViewChildren('productTile', { read: ElementRef })
  private productTiles!: QueryList<ElementRef<HTMLElement>>;

  private tileChanges?: Subscription;
  private categoryChanges?: Subscription;

  readonly categories = [
    { value: 'ALL', label: 'All' },
    { value: 'DAIRY', label: 'Dairy' },
    { value: 'POULTRY', label: 'Poultry' },
    { value: 'VEGETABLES', label: 'Vegetables' },
  ];

  readonly selectedCategory = signal('ALL');

  readonly categoryExperience: Record<string, { eyebrow: string; title: string; description: string; visual: string; visualLabel: string }> = {
    ALL: { eyebrow: 'FRESH FROM OUR FARM', title: 'Goodness from the farm, all in one place', description: 'Explore fresh dairy, desi poultry and seasonal vegetables, carefully brought to your home.', visual: '🧺', visualLabel: 'A basket of farm-fresh produce' },
    DAIRY: { eyebrow: 'FRESH MILK & DAIRY', title: 'Dairy goodness, delivered fresh', description: 'Milk, curd, butter, paneer and more — fresh from our farm to your family.', visual: '🥛', visualLabel: 'A fresh glass of milk' },
    POULTRY: { eyebrow: 'DESI & FARM FRESH', title: 'Farm-raised poultry, full of goodness', description: 'Explore fresh desi eggs and carefully raised poultry from our farm.', visual: '🥚', visualLabel: 'A tray of farm-fresh eggs' },
    VEGETABLES: { eyebrow: 'SEASONAL & LOCALLY GROWN', title: 'Fresh vegetables, picked for you', description: 'Bring home seasonal, farm-grown vegetables selected for freshness and flavour.', visual: '🥬', visualLabel: 'A basket of fresh vegetables' },
  };

  get activeCategoryExperience() {
    return this.categoryExperience[this.selectedCategory()] ?? this.categoryExperience['ALL'];
  }
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
    this.categoryChanges?.unsubscribe();
  }

  ngOnInit(): void {
    this.cartService.loadCart();
    this.categoryChanges = this.route.queryParamMap.subscribe((params) => {
      const requestedCategory = (params.get('category') ?? 'ALL').trim().toUpperCase();
      const validCategory = this.categories.some((category) => category.value === requestedCategory);
      this.selectedCategory.set(validCategory ? requestedCategory : 'ALL');
      this.applyFilters();
    });
    this.loadProducts();
  }

  loadProducts(category?: ProductCategory): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.productService.getProducts(category).subscribe({
      next: (response: Product[]) => {
        this.allProducts.set(response);
        this.applyFilters();
        this.loading.set(false);
      },
      error: (error) => {
        console.error(error);
        this.errorMessage.set('Unable to load products. Please check your connection and try again.');
        this.loading.set(false);
      },
    });
  }

  selectCategory(category: string): void {
    const validCategory = this.categories.some((item) => item.value === category);
    if (!validCategory) return;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: category === 'ALL' ? null : category },
      queryParamsHandling: 'merge',
    });
  }

  categoryDescription(): string {
    switch (this.farmCategory.selected()) {
      case 'POULTRY': return 'Farm-raised poultry products, selected with care and delivered to your doorstep.';
      case 'VEGETABLES': return 'Fresh, seasonal vegetables grown on our farm and brought straight to your kitchen.';
      default: return 'Milk, curd, butter, paneer and more, delivered fresh from our farm.';
    }
  }

  clearSearch(): void {
    this.searchText.set('');
    this.applyFilters();
  }

  search(event: Event): void {
    this.searchText.set((event.target as HTMLInputElement).value.trim().toLowerCase());
    this.applyFilters();
  }

  private applyFilters(): void {
    const category = this.selectedCategory();
    const search = this.searchText();

    const filtered = this.allProducts().filter((product) => {
      const productCategory = (product.category ?? '').trim().toUpperCase();
      const matchesCategory = category === 'ALL' || productCategory === category;
      const matchesSearch = !search ||
        product.name.toLowerCase().includes(search) ||
        (product.description ?? '').toLowerCase().includes(search) ||
        (product.unit ?? '').toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });

    this.filteredProducts.set(filtered);
  }

  addToCart(productId: number): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    const product = this.allProducts().find((x) => x.id === productId);
    if (!product) return;

    if (product.sizes?.length) {
      this.bottomSheet
        .open(ProductSizeSheet, { data: product })
        .afterDismissed()
        .subscribe((size: ProductSize) => {
          if (!size) return;
          this.cartService.addToCart({ productId, productSizeId: size.id, quantity: 1 }).subscribe();
        });
      return;
    }

    this.cartService.addToCart({ productId, quantity: 1 }).subscribe();
  }

  increase(productId: number): void {
    const item = this.cartService.getCartItem(productId);
    if (!item) return;
    this.cartService.increaseQuantity(item.id).subscribe({
      next: () => this.cartService.loadCart(),
    });
  }

  decrease(productId: number): void {
    const item = this.cartService.getCartItem(productId);
    if (!item) return;

    const request = item.quantity === 1
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