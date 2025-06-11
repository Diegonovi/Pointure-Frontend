import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environment/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.baseUrl}auth/login`;
  private tokenKey = 'token';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {}

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<{ token: string }>(this.apiUrl, { email, password })
      .pipe(
        tap((response) => {
          if (response?.token) {
            this.cookieService.set(
              this.tokenKey,
              response.token,
              7,
              '/',
              '',
              true,
              'Strict'
            );
          }
        }),
        catchError((err) => {
          console.error('Login failed', err);
          return throwError(() => err);
        })
      );
  }

  logout(): void {
    this.cookieService.delete(this.tokenKey, '/');
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return this.cookieService.check(this.tokenKey);
  }

  getToken(): string | null {
    return this.cookieService.get(this.tokenKey) || null;
  }
}
