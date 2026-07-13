import {
  Component,
  inject
} from '@angular/core';

import {
  LoaderService
} from '../../../core/services/loader';

@Component({
  selector: 'app-loader',

  standalone: true,

  imports: [],

  templateUrl: './app-loader.html',

  styleUrl: './app-loader.scss'
})
export class AppLoader {

  readonly loaderService =
    inject(LoaderService);

}