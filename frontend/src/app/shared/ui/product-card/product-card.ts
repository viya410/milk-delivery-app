import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { Product } from '../../../features/products/models/product';
import { CartAnimationService } from '../../../core/services/cart-animation';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCardComponent {
  private readonly animationService = inject(CartAnimationService);

  @ViewChild('productImage', { static: true })
  productImage!: ElementRef<HTMLImageElement>;

  @Input({ required: true })
  product!: Product;

  @Input()
  quantity = 0;

  @Output()
  view = new EventEmitter<number>();

  @Output()
  add = new EventEmitter<number>();

  @Output()
  increase = new EventEmitter<number>();

  @Output()
  decrease = new EventEmitter<number>();

  viewProduct(): void {
    this.view.emit(this.product.id);
  }

  addToCart(event: MouseEvent): void {
    event.stopPropagation();

    this.animationService.animate(this.productImage.nativeElement);

    this.add.emit(this.product.id);
  }

  // imageError(event: Event): void {
  //   (event.target as HTMLImageElement).src = 'assets/images/products/no-image.png';
  // }
  getDisplayPrice(): number {
    if (this.product.sizes?.length) {
      return this.product.sizes[0].price;
    }

    return this.product.price;
  }

  getDisplayUnit(): string {
    if (this.product.sizes?.length) {
      return this.product.sizes[0].size;
    }

    return this.product.unit;
  }
}
