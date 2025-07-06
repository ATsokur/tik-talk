import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

import { CookieService } from 'ngx-cookie-service';
import { catchError, tap, throwError } from 'rxjs';

import { BASE_API_URL } from '@tt/shared';

import { TokenResponse } from './auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly cookieService = inject(CookieService);
  private readonly router = inject(Router);

  public token = signal<string | null>(null);
  public refreshToken: string | null = null;

  get isAuth(): boolean {
    if (!this.token()) {
      this.token.set(this.cookieService.get('token'));
      this.refreshToken = this.cookieService.get('refreshToken');
      this.token.set(this.cookieService.get('token'));
    }
    return !!this.token();
  }

  login(payload: { username: string; password: string }) {
    const fd = new FormData();

    fd.append('username', payload.username);
    fd.append('password', payload.password);
    return this.http
      .post<TokenResponse>(`${BASE_API_URL}auth/token`, fd)
      .pipe(tap((res) => this.saveTokens(res)));
  }

  refreshAuthToken() {
    return this.http
      .post<TokenResponse>(`${BASE_API_URL}auth/refresh`, {
        refresh_token: this.refreshToken
      })
      .pipe(
        tap((res) => this.saveTokens(res)),
        catchError((error) => {
          this.logout();
          return throwError(error);
        })
      );
  }

  logout() {
    this.cookieService.deleteAll();
    this.token.set(null);
    this.refreshToken = null;
    this.router.navigate(['/login']);
  }

  saveTokens(res: TokenResponse) {
    this.token.set(res.access_token);
    this.refreshToken = res.refresh_token;
    this.token.set(res.access_token);

    this.cookieService.set('token', res.access_token);
    this.cookieService.set('refreshToken', this.refreshToken);
  }
}
