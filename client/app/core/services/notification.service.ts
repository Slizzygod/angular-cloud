import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly zone: NgZone,
  ) {}

  default(message: string, duration: number = 2000, timeout?: number) {
    this.show(message, {
      duration,
      panelClass: 'default-notification-overlay'
    }, timeout);
  }

  info(message: string, duration: number = 2000, timeout?: number) {
    this.show(message, {
      duration,
      panelClass: 'info-notification-overlay'
    }, timeout);
  }

  success(message: string, duration: number = 2000, timeout?: number) {
    this.show(message, {
      duration,
      panelClass: 'success-notification-overlay'
    }, timeout);
  }

  warn(message: string, duration: number = 2500, timeout?: number) {
    this.show(message, {
      duration,
      panelClass: 'warning-notification-overlay'
    }, timeout);
  }

  error(message: string, duration: number = 3000, timeout?: number) {
    this.show(message, {
      duration,
      panelClass: 'error-notification-overlay'
    }, timeout);
  }

  private show(message: string, configuration: MatSnackBarConfig, timeout?: number) {
    if (timeout && timeout > 0) {
      setTimeout(() => {
        this.zone.run(() => this.snackBar.open(message, null, configuration));
      }, timeout);
    } else {
      this.zone.run(() => this.snackBar.open(message, null, configuration));
    }
  }

}
