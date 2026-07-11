import {
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { InventoryService } from '../../../../core/services/inventory';

@Component({
  selector: 'app-inventory-transactions',

  standalone: true,

  imports: [

    CommonModule,

    FormsModule,

    MatTableModule,

    MatCardModule,

    MatIconModule

  ],

  templateUrl: './inventory-transaction.html',

  styleUrl: './inventory-transaction.scss'

})
export class InventoryTransactions implements OnInit {

  readonly inventoryService = inject(InventoryService);

  readonly search = signal('');

  readonly displayedColumns = [

    'date',

    'product',

    'type',

    'quantity',

    'remarks',

    'reference'

  ];

  readonly filteredTransactions = computed(() => {

    const keyword = this.search()

      .trim()

      .toLowerCase();

    if (!keyword) {

      return this.inventoryService.transactions();

    }

    return this.inventoryService

      .transactions()

      .filter(transaction =>

        transaction.productName

          .toLowerCase()

          .includes(keyword)

        ||

        transaction.type

          .toLowerCase()

          .includes(keyword)

      );

  });

  ngOnInit(): void {

    this.inventoryService

      .loadTransactions()

      .subscribe();

  }

  updateSearch(value: string) {

    this.search.set(value);

  }

}