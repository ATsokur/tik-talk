import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { map, tap } from 'rxjs';

import { Profile } from './profile.interface';

import { Pageble } from '../shared';
import { BASE_API_URL } from '@tt/shared';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  public me = signal<Profile | null>(null);

  getTestAccounts() {
    return this.http.get<Profile[]>(`${BASE_API_URL}account/test_accounts`);
  }

  getMe() {
    return this.http.get<Profile>(`${BASE_API_URL}account/me`).pipe(
      tap((res) => {
        this.me.set(res);
      })
    );
  }

  getAccount(id: string) {
    return this.http.get<Profile>(`${BASE_API_URL}account/${id}`);
  }

  getSubscribersShortList(subsAmount = 4) {
    return this.http
      .get<Pageble<Profile>>(`${BASE_API_URL}account/subscribers/`)
      .pipe(
        map((res) => {
          const accounts = res.items.filter(({ id }) => id !== 500);
          return accounts.slice(0, subsAmount);
        })
      );
  }

  patchProfile(profile: Partial<Profile>) {
    return this.http.patch<Profile>(`${BASE_API_URL}account/me`, profile);
  }

  uploadAvatar(file: File) {
    const fd = new FormData();
    fd.append('image', file);

    return this.http.post<Profile>(`${BASE_API_URL}account/upload_image`, fd);
  }

  filterProfiles(params: Record<string, string | any>) {
    return this.http.get<Pageble<Profile>>(`${BASE_API_URL}account/accounts`, {
      params
    });
  }
}
