import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuthService } from '../../../core/services/auth';
import { LayoutService } from '../../../core/services/layout';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {

  readonly authService = inject(AuthService);
  readonly router = inject(Router);

  readonly layoutService = inject(LayoutService);
  
  readonly isAdmin = () =>
  this.authService.user()?.role === 'ROLE_ADMIN';

  readonly isDeliveryPartner = () =>
  this.authService.user()?.role === 'ROLE_DELIVERY_PARTNER';

  constructor() {
this.router.events
  .pipe(filter(event => event instanceof NavigationEnd))
  .subscribe(() => {

    if (window.innerWidth <= 768) {
      this.layoutService.collapseSidebar();
    }

  });
    effect(() => {

      console.log(
        'Sidebar Expanded:',
        this.layoutService.sidebarExpanded()
      );

    });

  }

}