import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartAnimationService {
  animate(image: HTMLImageElement): void {
    const cart = document.getElementById('floating-cart');

    if (!cart) {
      return;
    }

    const imageRect = image.getBoundingClientRect();
    const cartRect = cart.getBoundingClientRect();

    const clone = image.cloneNode(true) as HTMLImageElement;

    clone.style.position = 'fixed';
    clone.style.left = `${imageRect.left}px`;
    clone.style.top = `${imageRect.top}px`;
    clone.style.width = `${imageRect.width}px`;
    clone.style.height = `${imageRect.height}px`;

    clone.style.zIndex = '99999';
    clone.style.pointerEvents = 'none';
    clone.style.borderRadius = '16px';
    clone.style.objectFit = 'contain';

    document.body.appendChild(clone);

    requestAnimationFrame(() => {
      clone.style.transition = 'all 1400ms cubic-bezier(.19,1,.22,1)';

      clone.style.left = `${cartRect.left + cartRect.width / 2 - 15}px`;

      clone.style.top = `${cartRect.top + cartRect.height / 2 - 15}px`;

      clone.style.width = '30px';
      clone.style.height = '30px';

      clone.style.opacity = '0.25';

      clone.style.transform = 'scale(.2) rotate(20deg)';
    });

    clone.addEventListener(
      'transitionend',
      () => {
        clone.remove();

        cart.classList.add('cart-bounce');

        setTimeout(() => {
          cart.classList.remove('cart-bounce');
        }, 400);
      },
      { once: true },
    );
  }
}
