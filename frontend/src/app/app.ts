import {
  Component,
  signal
} from '@angular/core';

import {
  RouterOutlet
} from '@angular/router';

import {
  FloatingCartComponent
} from './shared/ui/floating-cart/floating-cart';

import {
  AnimationLayerComponent
} from './shared/ui/animation-layer/animation-layer';

import {
  ToasterComponent
} from './shared/components/toaster/toaster';

import {
  AppLoader
} from './shared/components/app-loader/app-loader';

@Component({
  selector: 'app-root',

  standalone: true,

  imports: [
    RouterOutlet,
    FloatingCartComponent,
    AnimationLayerComponent,
    ToasterComponent,
    AppLoader
  ],

  templateUrl: './app.html',

  styleUrl: './app.scss'
})
export class App {

  protected readonly title =
    signal('milk-delivery-app');

}