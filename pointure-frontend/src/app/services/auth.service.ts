import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://your-api.com/api/auth/login';
  private tokenKey = 'token';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>(this.apiUrl, { email, password }).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem(this.tokenKey, response.token);
        }
      }),
      catchError(err => {
        console.error('Login failed', err);
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
