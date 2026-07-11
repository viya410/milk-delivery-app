import { Injectable } from '@angular/core';

export interface Toaster {
  show(message: string, type: ToastType, duration: number): void;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  private toaster?: Toaster;

  register(toaster: Toaster): void {
    this.toaster = toaster;
  }

  success(message: string, duration = 5000): void {
    console.log('ToasterService: success', message);
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 5000): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration = 5000): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration = 5000): void {
    this.show(message, 'info', duration);
  }

  private show(message: string, type: ToastType, duration: number): void {
    console.log(`ToasterService: ${type}`, message);
    this.toaster?.show(message, type, duration);
  }
}
