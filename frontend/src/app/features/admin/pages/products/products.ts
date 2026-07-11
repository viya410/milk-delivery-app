import { Component, OnInit, computed, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AdminProductService } from '../../../../core/services/admin-product';

import { ProductDialog } from './product-dialog/product-dialog';

import { AdminProduct } from '../../../../core/models/admin-product.model';
import { ToasterService } from '../../../../core/services/toaster';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatTooltipModule,
  ],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {
  private dialog = inject(MatDialog);

  readonly productService = inject(AdminProductService);

  readonly displayedColumns = ['name', 'price', 'unit', 'available', 'actions'];

  readonly searchText = signal('');

  readonly selectedFilter = signal('ALL');
  toasterService = inject(ToasterService);

  readonly filteredProducts = computed(() => {
    let products = this.productService.products();

    const filter = this.selectedFilter();

    const search = this.searchText()

      .trim()

      .toLowerCase();

    if (filter === 'AVAILABLE') {
      products = products.filter((product) => product.available);
    }

    if (filter === 'UNAVAILABLE') {
      products = products.filter((product) => !product.available);
    }

    if (!search) {
      return products;
    }

    return products.filter(
      (product) =>
        product.name

          .toLowerCase()

          .includes(search) ||
        product.unit

          .toLowerCase()

          .includes(search),
    );
  });

  readonly totalProducts = computed(() => this.productService.products().length);

  readonly availableProducts = computed(
    () =>
      this.productService

        .products()

        .filter((product) => product.available).length,
  );

  readonly unavailableProducts = computed(
    () =>
      this.productService

        .products()

        .filter((product) => !product.available).length,
  );

  ngOnInit(): void {
    this.productService

      .loadProducts()

      .subscribe();
  }

  changeFilter(filter: string): void {
    this.selectedFilter.set(filter);
  }

  updateSearch(value: string): void {
    this.searchText.set(value);
  }

  addProduct(): void {
    const dialogRef = this.dialog.open(ProductDialog, {
      width: '700px',
      maxWidth: '75vw',
      maxHeight: '75vh',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      this.productService.addProduct(result).subscribe({
        next: () => {
          this.toasterService.success('Product added successfully.', 5000);
        },
        error: (err) => {
          console.error(err);
          this.toasterService.error('Failed to add product.');
        },
      });
    });
  }

  editProduct(product: AdminProduct): void {
    console.log('Editing product:', product);
    const dialogRef = this.dialog.open(ProductDialog, {
      width: '700px',
      maxWidth: '75vw',
      maxHeight: '75vh',
      autoFocus: false,
      data: product,
    });

    dialogRef
      .afterClosed()

      .subscribe((result) => {
        if (!result) {
          return;
        }
        console.log(result);
        this.productService

          .updateProduct(result)

          .subscribe();
      });
  }

  deleteProduct(id: number): void {
    if (!confirm('Delete this product?')) {
      return;
    }

    this.productService

      .deleteProduct(id)

      .subscribe();
  }

  getAvailabilityLabel(available: boolean): string {
    return available ? 'Available' : 'Out of Stock';
  }

  getAvailabilityClass(available: boolean): string {
    return available ? 'available' : 'unavailable';
  }

  productImageError(event: Event) {
    const img = event.target as HTMLImageElement;
  }

  getDisplayPrice(product: AdminProduct): number {
    return product.sizes?.length ? product.sizes[0].price : product.price;
  }
}
