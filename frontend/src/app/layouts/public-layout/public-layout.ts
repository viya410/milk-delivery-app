import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../../shared/components/footer/footer';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Header } from '../../shared/components/header/header';
import { LayoutService } from '../../core/services/layout';
import { CustomerBottomNavComponent } from '../../shared/ui/customer-bottom-nav/customer-bottom-nav';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar, Footer, Header, CustomerBottomNavComponent],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss',
})
export class PublicLayout {
  layoutService = inject(LayoutService);
}
