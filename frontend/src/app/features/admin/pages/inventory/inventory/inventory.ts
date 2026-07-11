import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { InventoryService } from '../../../../../core/services/inventory';
import { Inventory } from '../../../../../core/models/inventory.model';
import { InventoryDialog } from '../inventory-dialog/inventory-dialog';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  templateUrl: './inventory.html',
  styleUrl: './inventory.scss',
})
export class InventoryComponent implements OnInit {
  readonly inventoryService = inject(InventoryService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  readonly displayedColumns = ['product', 'current', 'reserved', 'available', 'actions'];
  readonly search = signal('');
  readonly totalProducts = computed(() => this.inventoryService.inventory().length);
  readonly totalCurrentStock = computed(() =>
    this.inventoryService.inventory().reduce((sum, item) => sum + item.currentStock, 0),
  );
  readonly totalReservedStock = computed(() =>
    this.inventoryService.inventory().reduce((sum, item) => sum + item.reservedStock, 0),
  );
  readonly totalAvailableStock = computed(() =>
    this.inventoryService.inventory().reduce((sum, item) => sum + item.availableStock, 0),
  );
  readonly filteredInventory = computed(() => {
    const keyword = this.search().trim().toLowerCase();

    if (!keyword) {
      return this.inventoryService.inventory();
    }

    return this.inventoryService
      .inventory()
      .filter((item) => item.productName.toLowerCase().includes(keyword));
  });
  readonly businessDay = this.inventoryService.businessDay;
  readonly isBusinessDayOpen = computed(() => this.businessDay()?.status === 'OPEN');
  readonly hasBusinessDay = computed(() => this.businessDay() !== null);

  ngOnInit(): void {
    this.inventoryService.loadInventory().subscribe();
    this.inventoryService.loadBusinessDay().subscribe();
  }

  updateSearch(value: string) {
    this.search.set(value);
  }

  addStock(item: Inventory) {
    this.dialog
      .open(InventoryDialog, {
        width: '500px',
        data: {
          action: 'ADD',
          inventory: item,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (!result) {
          return;
        }

        this.inventoryService.addStock(item.productId, result.quantity, result.remarks).subscribe();
      });
  }

  removeStock(item: Inventory) {
    this.dialog
      .open(InventoryDialog, {
        width: '500px',
        data: {
          action: 'REMOVE',
          inventory: item,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (!result) {
          return;
        }

        this.inventoryService
          .removeStock(item.productId, result.quantity, result.remarks)
          .subscribe();
      });
  }

  adjustStock(item: Inventory) {
    this.dialog
      .open(InventoryDialog, {
        width: '500px',
        data: {
          action: 'ADJUST',
          inventory: item,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (!result) {
          return;
        }

        this.inventoryService
          .adjustStock(item.productId, result.quantity, result.remarks)
          .subscribe();
      });
  }

  startBusinessDay() {
    this.inventoryService.startBusinessDay().subscribe();
  }

  generateTodayOrders() {
    this.inventoryService.generateTodayOrders().subscribe();
  }

closeBusinessDay() {
  this.inventoryService.closeBusinessDay().subscribe(() => {
    this.inventoryService.loadBusinessDay().subscribe();
    this.inventoryService.loadInventory().subscribe();
  });
}
  viewTransactions(): void {
    this.router.navigate(['/admin/inventory-transactions']);
  }
  viewBusinessSummary(): void {
  this.router.navigate(['/admin/business-summary']);
}

}
