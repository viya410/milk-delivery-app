import { Injectable, inject } from '@angular/core';
import { MotionService } from './motion';

@Injectable({ providedIn: 'root' })
export class CartAnimationService {
  private readonly motion = inject(MotionService);

  animate(image: HTMLImageElement): void {
    const cart = document.getElementById('floating-cart');
    if (!cart) return;
    this.motion.animateCartFly(image, cart);
  }
}
