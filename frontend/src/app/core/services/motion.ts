import { Injectable } from '@angular/core';
import { gsap } from 'gsap';

@Injectable({ providedIn: 'root' })
export class MotionService {
  private prefersReducedMotion(): boolean {
    return typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  animateEntrance(elements: HTMLElement[]): void {
    const visibleElements = elements.filter(Boolean);
    if (!visibleElements.length) return;

    if (this.prefersReducedMotion()) {
      gsap.set(visibleElements, { clearProps: 'all' });
      return;
    }

    gsap.fromTo(
      visibleElements,
      { autoAlpha: 0, y: 22 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.12,
        ease: 'power2.out',
        clearProps: 'transform',
      },
    );
  }

  animateCartFly(image: HTMLImageElement, target: HTMLElement): void {
    if (this.prefersReducedMotion()) return;
    const source = image.getBoundingClientRect();
    const destination = target.getBoundingClientRect();
    const clone = image.cloneNode(true) as HTMLImageElement;
    Object.assign(clone.style, {
      position: 'fixed', left: `${source.left}px`, top: `${source.top}px`,
      width: `${source.width}px`, height: `${source.height}px`,
      zIndex: '100000', pointerEvents: 'none', objectFit: 'contain',
      borderRadius: '16px', margin: '0',
      filter: 'drop-shadow(0 8px 12px rgba(46,125,50,.28))',
    });
    document.body.appendChild(clone);
    gsap.to(clone, {
      left: destination.left + destination.width / 2 - 15,
      top: destination.top + destination.height / 2 - 15,
      width: 30, height: 30, opacity: 0.15, scale: 0.2, rotation: 28,
      duration: 0.78, ease: 'back.in(1.4)',
      onComplete: () => {
        clone.remove();
        target.classList.remove('cart-bounce');
        void target.offsetWidth;
        target.classList.add('cart-bounce');
        const badge = target.querySelector('.cart-badge');
        if (badge) {
          badge.classList.remove('cart-badge-pop');
          void (badge as HTMLElement).offsetWidth;
          badge.classList.add('cart-badge-pop');
          gsap.delayedCall(0.55, () => badge.classList.remove('cart-badge-pop'));
        }
        gsap.delayedCall(0.55, () => target.classList.remove('cart-bounce'));
      },
      onInterrupt: () => clone.remove(),
    });
  }
}
