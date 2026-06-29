import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  sidebarExpanded = signal(true);

  toggleSidebar() {
    this.sidebarExpanded.update(value => !value);
  }

}