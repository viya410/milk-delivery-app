import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LayoutService } from '../../../core/services/layout';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatSidenavModule, MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  authService = inject(AuthService);
  layoutService = inject(LayoutService);

  logout() {
    console.log('logout clicked');
    this.authService.logout();
  }
}
