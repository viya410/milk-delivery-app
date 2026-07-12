import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { signal } from '@angular/core';
import { ProductService } from '../../../../core/services/product';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing implements OnInit {
  @ViewChild('contactSection')
  contactSection!: ElementRef<HTMLElement>;

  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  readonly products = signal<any[]>([]);
  readonly currentYear = new Date().getFullYear();
  readonly mobileMenuOpen = signal(false);
  readonly imageBaseUrl = `${environment.apiUrl}/uploads/`;

  constructor() {}

  ngOnInit(): void {
    console.log('Landing ngOnInit');
    this.loadFeaturedProducts();
  }

  private loadFeaturedProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        console.log('Received products:', products);

        this.products.set(products.slice(0, 4));

        console.log('Assigned products:', this.products());
        console.log('Assigned length:', this.products().length);
      },
      error: (error) => {
        console.error('Failed to load products:', error);
      },
      complete: () => {
        console.log('Products request completed');
      },
    });
  }
  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }

  scrollToContact(): void {
    this.contactSection?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  scrollToSection(sectionId: string): void {
    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    section.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((value) => !value);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
  getProductImage(image: string): string {
    if (!image) {
      console.log('no image');
      return '';
    }
    console.log('image', image);
    return `assets/images/products/${image}`;
  }
  getPriceDisplay(product: any): string {
    if (!product?.sizes || product.sizes.length === 0) {
      return `₹${product.price} / ${product.unit}`;
    }

    return `${product.sizes[0].price}/${product.sizes[0].size}`;
  }

  private formatSize(size: any): string {
    const unit = size.unit?.toLowerCase() ?? '';

    return `${size.size} ${unit}`;
  }
}
