import { Injectable } from '@angular/core';
import { gsap } from 'gsap';

@Injectable({ providedIn: 'root' })
export class MotionService {
  private prefersReducedMotion(): boolean {
    return typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  animateCartFly(image: HTMLImageElement, target: HTMLElement): void {
    if (this.prefersReducedMotion()) return;

    const source = image.getBoundingClientRect();
    const destination = target.getBoundingClientRect();
    const clone = image.cloneNode(true) as HTMLImageElement;

    Object.assign(clone.style, {
      position: 'fixed',
      left: `${source.left}px`,
      top: `${source.top}px`,
      width: `${source.width}px`,
      height: `${source.height}px`,
      zIndex: '100000',
      pointerEvents: 'none',
      objectFit: 'contain',
      borderRadius: '16px',
      margin: '0',
    });

    document.body.appendChild(clone);

    gsap.to(clone, {
      left: destination.left + destination.width / 2 - 15,
      top: destination.top + destination.height / 2 - 15,
      width: 30,
      height: 30,
      opacity: 0.2,
      scale: 0.25,
      rotation: 20,
      duration: 0.85,
      ease: 'power3.inOut',
      onComplete: () => {
        clone.remove();
        gsap.fromTo(target, { scale: 1 }, {
          scale: 1.12,
          duration: 0.16,
          yoyo: true,
          repeat: 1,
          ease: 'power1.inOut',
        });
      },
      onInterrupt: () => clone.remove(),
    });
  }
}
