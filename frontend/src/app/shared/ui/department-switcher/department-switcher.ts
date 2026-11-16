import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth';
import { FarmCategoryService } from '../../../core/services/farm-category';
import { ProductCategory } from '../../../features/products/models/product';

@Component({
  selector: 'app-department-switcher',
  standalone: true,
  template: `
    @if (auth.isLoggedIn() && auth.user()?.role === 'ROLE_USER') {
      <nav class="department-switcher" aria-label="Choose farm department">
        <span class="switcher-label">SHOP BY</span>
        <div class="department-options">
          @for (category of categories; track category.value) {
            <button
              type="button"
              [class.active]="farmCategory.selected() === category.value"
              [attr.aria-pressed]="farmCategory.selected() === category.value"
              (click)="select(category.value)">
              {{ category.label }}
            </button>
          }
        </div>
      </nav>
    }
  `,
  styles: [`
    .department-switcher {
      display: flex;
      min-height: 54px;
      align-items: center;
      justify-content: center;
      gap: 14px;
      padding: 7px 16px;
      border-bottom: 1px solid #e8eee5;
      background: #fbfdf9;
    }
    .switcher-label {
      color: #829082;
      font-size: 10px;
      font-weight: 850;
      letter-spacing: .14em;
    }
    .department-options { display: flex; flex-wrap: wrap; gap: 7px; }
    button {
      min-height: 38px;
      padding: 0 17px;
      border: 1px solid #dce8d8;
      border-radius: 999px;
      background: #fff;
      color: #536452;
      font: inherit;
      font-size: 13px;
      font-weight: 750;
      cursor: pointer;
      transition: background .18s ease, color .18s ease, border-color .18s ease;
    }
    button.active {
      border-color: #2e7d32;
      background: #2e7d32;
      color: #fff;
      box-shadow: 0 4px 12px rgba(46,125,50,.16);
    }
    button:focus-visible { outline: 3px solid rgba(46,125,50,.28); outline-offset: 2px; }
    @media (max-width: 768px) {
      .department-switcher { position: sticky; top: 0; z-index: 80; min-height: 50px; justify-content: flex-start; gap: 9px; padding: 6px 12px; }
      .switcher-label { display: none; }
      .department-options { width: 100%; flex-wrap: nowrap; }
      button { flex: 1 1 0; min-height: 40px; padding: 0 9px; font-size: 12px; white-space: nowrap; }
    }
    @media (prefers-reduced-motion: reduce) { button { transition: none; } }
  `],
})
export class DepartmentSwitcherComponent {
  readonly auth = inject(AuthService);
  readonly farmCategory = inject(FarmCategoryService);
  readonly categories: { value: ProductCategory; label: string }[] = [
    { value: 'DAIRY', label: 'Dairy' },
    { value: 'POULTRY', label: 'Poultry' },
    { value: 'VEGETABLES', label: 'Vegetables' },
  ];

  select(category: ProductCategory): void {
    this.farmCategory.select(category);
  }
}
