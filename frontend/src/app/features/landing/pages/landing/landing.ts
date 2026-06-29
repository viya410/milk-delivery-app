import { Component } from '@angular/core';
import { OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ElementRef, ViewChild } from '@angular/core';


import { ProductService } from '../../../../core/services/product';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing implements OnInit {

  @ViewChild(
    'contactSection'
  )
  contactSection!: ElementRef;

  private productService =
    inject(ProductService);

  private router = inject(Router);

  products: any[] = [];

  ngOnInit(): void {

    this.productService
      .getProducts()
      .subscribe({

        next: (response) => {

          this.products =
            response.slice(0, 4);

        },

        error: (error) => {

          console.error(error);

        }
      });
  }

  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }

  scrollToContact(): void {

    this.contactSection
      ?.nativeElement
      .scrollIntoView({

        behavior: 'smooth'

      });

  }
}