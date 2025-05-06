import { HttpClient } from '@angular/common/http';
import {
  inject,
  Injectable,
} from '@angular/core';

import { tap } from 'rxjs';

import { TokenRespons } from './auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseApiUrl: string = 'https://icherniakov.ru/yt-course/auth';

  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  get isAuth(): boolean {
    return !!this.accessToken;
  }

  login(payload: { username: string; password: string }) {
    const fd = new FormData();

    fd.append('username', payload.username);
    fd.append('password', payload.password);
    return this.http.post<TokenRespons>(`${this.baseApiUrl}/token`, fd).pipe(
      tap((val) => {
        this.accessToken = val.access_token;
        this.refreshToken = val.refresh_token;
      })
    );
  }
}
