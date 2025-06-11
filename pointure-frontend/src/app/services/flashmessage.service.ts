import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class FlashMessageService {
  private flashKey = 'flashMessage';

  constructor(private cookieService: CookieService) {}

  setMessage(message: string) {
    this.cookieService.set(this.flashKey, message, 1, '/');
  }

  getMessage(): string | null {
    const message = this.cookieService.get(this.flashKey);
    if (message) {
      this.cookieService.delete(this.flashKey, '/');
      return message;
    }
    return null;
  }
}
