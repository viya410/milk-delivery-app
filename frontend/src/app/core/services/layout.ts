import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {

  readonly sidebarExpanded = signal(true);

  toggleSidebar(): void {
    this.sidebarExpanded.update(value => !value);
  }

  expandSidebar(): void {
    this.sidebarExpanded.set(true);
  }

  collapseSidebar(): void {
    this.sidebarExpanded.set(false);
  }

  setSidebar(expanded: boolean): void {
    this.sidebarExpanded.set(expanded);
  }

}