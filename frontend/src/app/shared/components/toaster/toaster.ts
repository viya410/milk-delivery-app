import { Component, OnDestroy, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toaster, ToasterService, ToastType } from '../../../core/services/toaster';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toaster.html',
  styleUrls: ['./toaster.scss'],
})
export class ToasterComponent implements OnInit, OnDestroy, Toaster {
  private readonly toasterService = inject(ToasterService);
  private readonly cdr = inject(ChangeDetectorRef);

  visible = false;
  message = '';
  type: ToastType = 'success';

  private timer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.toasterService.register(this);
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  show(message: string, type: ToastType = 'success', duration = 5000): void {
    this.clearTimer();

    this.message = message;
    this.type = type;
    this.visible = true;

    this.cdr.detectChanges();

    this.timer = setTimeout(() => this.close(), duration);
  }

  close(): void {
    this.clearTimer();

    this.visible = false;
    this.cdr.detectChanges();
  }

  private clearTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }
}
