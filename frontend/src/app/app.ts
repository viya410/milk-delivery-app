import { AfterViewInit, Component, ViewChild, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FloatingCartComponent } from './shared/ui/floating-cart/floating-cart';
import { AnimationLayerComponent } from './shared/ui/animation-layer/animation-layer';

import { ToasterComponent } from './shared/components/toaster/toaster';
import { ToasterService } from './core/services/toaster';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FloatingCartComponent, AnimationLayerComponent, ToasterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('milk-delivery-app');
}