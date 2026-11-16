import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService, CartItem } from '../../../../core/services/cart';
import { MotionService } from '../../../../core/services/motion';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnInit, AfterViewInit, OnDestroy {
  private readonly cartService = inject(CartService);
  private readonly motion = inject(MotionService);

  @ViewChildren('cartRow', { read: ElementRef })
  private cartRows!: QueryList<ElementRef<HTMLElement>>;

  private rowsSubscription?: Subscription;

  readonly cartItems = signal<CartItem[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');
  readonly busyItems = signal<Set<number>>(new Set());

  ngOnInit(): void {
    this.loadCart();
  }

  ngAfterViewInit(): void {
    this.rowsSubscription = this.cartRows.changes.subscribe((rows: QueryList<ElementRef<HTMLElement>>) => {
      this.motion.animateEntrance(rows.toArray().map((row) => row.nativeElement));
    });
    this.motion.animateEntrance(this.cartRows.toArray().map((row) => row.nativeElement));
  }

  ngOnDestroy(): void {
    this.rowsSubscription?.unsubscribe();
  }

  loadCart(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.cartService.getCart().subscribe({
      next: (response) => {
        this.cartItems.set([...response].sort((a, b) => a.id - b.id));
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('We could not load your cart. Please check your connection and try again.');
        this.loading.set(false);
      },
    });
  }

  private setBusy(id: number, busy: boolean): void {
    const next = new Set(this.busyItems());
    if (busy) next.add(id);
    else next.delete(id);
    this.busyItems.set(next);
  }

  isBusy(id: number): boolean {
    return this.busyItems().has(id);
  }

  increase(item: CartItem): void {
    if (item.quantity >= item.maxOrderQuantity || this.isBusy(item.id)) return;
    this.updateItem(item.id, this.cartService.increaseQuantity(item.id));
  }

  decrease(item: CartItem): void {
    if (this.isBusy(item.id)) return;
    const request = item.quantity <= 1
      ? this.cartService.removeItem(item.id)
      : this.cartService.decreaseQuantity(item.id);
    this.updateItem(item.id, request);
  }

  remove(id: number): void {
    if (this.isBusy(id)) return;
    this.updateItem(id, this.cartService.removeItem(id));
  }

  private updateItem(id: number, request: import('rxjs').Observable<unknown>): void {
    this.setBusy(id, true);
    this.errorMessage.set('');
    request.subscribe({
      next: () => {
        this.setBusy(id, false);
        this.loadCart();
      },
      error: () => {
        this.setBusy(id, false);
        this.errorMessage.set('That change could not be saved. Please try again.');
      },
    });
  }

  isMaxReached(item: CartItem): boolean {
    return item.quantity >= item.maxOrderQuantity;
  }

  getTotal(): number {
    return this.cartItems().reduce((total, item) => total + item.price * item.quantity, 0);
  }

  getItemCount(): number {
    return this.cartItems().reduce((total, item) => total + item.quantity, 0);
  }
}
