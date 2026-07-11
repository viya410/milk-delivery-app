import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { signal } from '@angular/core';
import { ProductService } from '../../../../core/services/product';
import { ToasterService } from '../../../../core/services/toaster';
import { MatIconModule } from '@angular/material/icon';

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

  products: any[] = [];

  readonly currentYear = new Date().getFullYear();
  readonly mobileMenuOpen = signal(false);
  readonly imageBaseUrl = 'http://localhost:8080/uploads/';

  constructor(private readonly toaster: ToasterService) {}

  ngOnInit(): void {
    console.log('Landing ngOnInit');
    this.loadFeaturedProducts();
    this.toaster.success('Hello from toaster!');
  }

  private loadFeaturedProducts(): void {
  this.productService.getProducts().subscribe({
    next: (products) => {
      console.log('Received products', products);

      this.products = products.slice(0, 4);

      console.log('Assigned products:', this.products);
      console.log('Assigned length:', this.products.length);

      setTimeout(() => {
        console.log('Length after 2 seconds:', this.products.length);
      }, 2000);
    }
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
    console.log('no image')
    return '';
  }
console.log('image', image)
  return `assets/images/products/${image}`;

}
}
