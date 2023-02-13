import { Injectable, ErrorHandler } from '@angular/core';
import { NotificationService } from './notification.service';


@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService extends ErrorHandler {
  constructor(
    private notificationsService: NotificationService
  ) {
    super();
  }

  override handleError(error: any): void {
    const displayMessage = error?.error || 'Неизвестная ошибка';

    this.notificationsService.error(displayMessage);
    super.handleError(error);
  }

}
