import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../../core/services/product';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../../../environments/environment';
import { ReviewService } from '../../../../core/services/review';
import { Review } from '../../../../core/models/review.model';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('contactSection')
  contactSection!: ElementRef<HTMLElement>;

  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  readonly products = signal<any[]>([]);
  readonly currentYear = new Date().getFullYear();
  readonly mobileMenuOpen = signal(false);
  readonly imageBaseUrl = `${environment.apiUrl}/uploads/`;

  private readonly reviewService = inject(ReviewService);

  readonly approvedReviews = signal<Review[]>([]);

  readonly activeSection = signal('home');

  private sectionObserver?: IntersectionObserver;

  private revealObserver?: IntersectionObserver;

  @ViewChild('testimonialSection')
  testimonialSection?: ElementRef<HTMLElement>;

  @ViewChild('testimonialGrid')
  testimonialGrid?: ElementRef<HTMLElement>;

  readonly activeTestimonial = signal(0);

  private testimonialInterval?: ReturnType<typeof setInterval>;

  private testimonialSectionObserver?: IntersectionObserver;

  private testimonialsVisible = false;

  constructor() {}

  ngOnInit(): void {
    this.loadFeaturedProducts();
    this.loadApprovedReviews();
  }

  ngAfterViewInit(): void {
    this.observeTestimonialsSection();

    this.observeLandingSections();

    this.observeScrollReveal();
  }

  private observeTestimonialsSection(): void {
    const section = this.testimonialSection?.nativeElement;

    if (!section) {
      return;
    }

    this.testimonialSectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        this.testimonialsVisible = entry.isIntersecting;

        if (this.testimonialsVisible) {
          this.startTestimonialAutoSlide();
        } else {
          this.stopTestimonialAutoSlide();
        }
      },
      {
        /*
         * Start animation when roughly
         * 35% of the testimonial section
         * is visible.
         */
        threshold: 0.35,
      },
    );

    this.testimonialSectionObserver.observe(section);
  }

  private startTestimonialAutoSlide(): void {
    /*
     * Prevent multiple intervals
     */
    if (this.testimonialInterval) {
      return;
    }

    /*
     * Mobile only
     */
    if (window.innerWidth > 768) {
      return;
    }

    /*
     * Need at least 2 reviews
     */
    if (this.approvedReviews().length <= 1) {
      return;
    }

    this.testimonialInterval = setInterval(() => {
      /*
       * Extra safety:
       * don't move cards if the section
       * is no longer visible.
       */
      if (!this.testimonialsVisible) {
        return;
      }

      const reviews = this.approvedReviews();

      if (reviews.length <= 1) {
        return;
      }

      const nextIndex = (this.activeTestimonial() + 1) % reviews.length;

      this.activeTestimonial.set(nextIndex);

      this.scrollToActiveTestimonial();
    }, 3000);
  }

  private scrollToActiveTestimonial(): void {
    const container = this.testimonialGrid?.nativeElement;

    if (!container) {
      return;
    }

    const cards = container.querySelectorAll<HTMLElement>('.testimonial');

    const activeCard = cards[this.activeTestimonial()];

    if (!activeCard) {
      return;
    }

    /*
     * Calculate the horizontal position
     * required to center the active card.
     *
     * IMPORTANT:
     * This scrolls ONLY the testimonial
     * container — not the whole page.
     */
    const scrollLeft = activeCard.offsetLeft - (container.clientWidth - activeCard.clientWidth) / 2;

    container.scrollTo({
      left: scrollLeft,
      behavior: 'smooth',
    });
  }

  private stopTestimonialAutoSlide(): void {
    if (!this.testimonialInterval) {
      return;
    }

    clearInterval(this.testimonialInterval);

    this.testimonialInterval = undefined;
  }

  ngOnDestroy(): void {
    this.stopTestimonialAutoSlide();

    this.testimonialSectionObserver?.disconnect();

    this.sectionObserver?.disconnect();
    this.revealObserver?.disconnect();
    document.querySelectorAll('.scroll-reveal-pending').forEach((element) => {
      element.classList.remove('scroll-reveal-pending');
    });
    document.body.style.overflow = '';
  }

  private loadFeaturedProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        console.log('Received products:', products);

        this.products.set(products.slice(0, 4));
        setTimeout(() => this.observeScrollReveal());

        console.log('Assigned products:', this.products());
        console.log('Assigned length:', this.products().length);
      },
      error: (error) => {
        console.error('Failed to load products:', error);
      },
      complete: () => {
        console.log('Products request completed');
      },
    });
  }
  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }

  scrollToContact(): void {
    this.contactSection?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  scrollToSection(sectionId: string): void {
    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    /*
     * Immediately update the underline.
     */
    this.activeSection.set(sectionId);

    section.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  navigateToSection(sectionId: string): void {
    this.closeMobileMenu();

    setTimeout(() => {
      this.scrollToSection(sectionId);
    }, 100);
  }

  toggleMobileMenu(): void {
    const isOpening = !this.mobileMenuOpen();

    this.mobileMenuOpen.set(isOpening);

    document.body.style.overflow = isOpening ? 'hidden' : '';
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);

    document.body.style.overflow = '';
  }
  getProductImage(image: string): string {
    if (!image) {
      console.log('no image');
      return '';
    }
    console.log('image', image);
    return `assets/images/products/${image}`;
  }
  getPriceDisplay(product: any): string {
    if (!product?.sizes || product.sizes.length === 0) {
      return `₹${product.price} / ${product.unit}`;
    }

    return `${product.sizes[0].price}/${product.sizes[0].size}`;
  }

  private formatSize(size: any): string {
    const unit = size.unit?.toLowerCase() ?? '';

    return `${size.size} ${unit}`;
  }

  private loadApprovedReviews(): void {
    this.reviewService.getApprovedReviews().subscribe({
      next: (reviews) => {
        const latestThreeReviews = [...reviews]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3);

        this.approvedReviews.set(latestThreeReviews);

        this.activeTestimonial.set(0);
      },

      error: (error) => {
        console.error('Failed to load approved reviews:', error);

        this.approvedReviews.set([]);
      },
    });
  }

  getRelativeTime(createdAt: string): string {
    const createdDate = new Date(createdAt);
    const now = new Date();

    const differenceInMilliseconds = now.getTime() - createdDate.getTime();

    const seconds = Math.floor(differenceInMilliseconds / 1000);

    const minutes = Math.floor(seconds / 60);

    const hours = Math.floor(minutes / 60);

    const days = Math.floor(hours / 24);

    const weeks = Math.floor(days / 7);

    const months = Math.floor(days / 30);

    const years = Math.floor(days / 365);

    if (seconds < 60) {
      return 'Just now';
    }

    if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }

    if (hours < 24) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }

    if (days < 7) {
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }

    if (weeks < 5) {
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    }

    if (months < 12) {
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }

    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }

  private observeScrollReveal(): void {
    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-scroll-reveal]:not(.is-visible)'),
    );

    if (!revealElements.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches
      || !('IntersectionObserver' in window)) {
      revealElements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    revealElements.forEach((element) => element.classList.add('scroll-reveal-pending'));

    this.revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px',
      },
    );

    revealElements.forEach((element) => this.revealObserver?.observe(element));
  }

  private observeLandingSections(): void {
    const sectionIds = [
      'home',
      'features',
      'process',
      'products',
      'plans',
      'testimonials',
      'contact',
    ];

    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleSections.length === 0) {
          return;
        }

        this.activeSection.set(visibleSections[0].target.id);
      },
      {
        /*
         * The active section is determined
         * around the middle of the screen.
         */
        rootMargin: '-20% 0px -55% 0px',

        threshold: [0, 0.1, 0.25, 0.5],
      },
    );

    sectionIds.forEach((sectionId) => {
      const section = document.getElementById(sectionId);

      if (section) {
        this.sectionObserver?.observe(section);
      }
    });
  }
}
