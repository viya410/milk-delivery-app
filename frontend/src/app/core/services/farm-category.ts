import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProductCategory } from '../../features/products/models/product';

const STORAGE_KEY = 'fresh-farm-active-category';

@Injectable({ providedIn: 'root' })
export class FarmCategoryService {
  private readonly router = inject(Router);
  readonly selected = signal<ProductCategory>(this.readSavedCategory());

  private readSavedCategory(): ProductCategory {
    if (typeof localStorage === 'undefined') return 'DAIRY';
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'POULTRY' || saved === 'VEGETABLES' ? saved : 'DAIRY';
  }

  select(category: ProductCategory): void {
    this.selected.set(category);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, category);
    }
    void this.router.navigate(['/products']);
  }

  label(category: ProductCategory = this.selected()): string {
    switch (category) {
      case 'POULTRY': return 'Poultry';
      case 'VEGETABLES': return 'Vegetables';
      default: return 'Dairy';
    }
  }
}
