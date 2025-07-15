import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map } from 'rxjs';

import { BASE_API_URL } from '@tt/shared';

import { Pageble } from '../shared';
import { Profile } from './profile.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly http = inject(HttpClient);

  getTestAccounts() {
    return this.http.get<Profile[]>(`${BASE_API_URL}account/test_accounts`);
  }

  getMe() {
    return this.http.get<Profile>(`${BASE_API_URL}account/me`);
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

  getSubscribersShortListById(subsAmount = 4, accountId: number) {
    return this.http
      .get<Pageble<Profile>>(`${BASE_API_URL}account/subscribers/${accountId}`)
      .pipe(
        map((res) => {
          const accounts = res.items.filter(({ id }) => id !== 500);
          return accounts.slice(0, subsAmount);
        })
      );
  }

  toSubscribe(accountId: number) {
    return this.http.post<string>(
      `${BASE_API_URL}account/subscribe/${accountId}`,
      {}
    );
  }

  toUnsubscribe(accountId: number) {
    return this.http.delete<string>(
      `${BASE_API_URL}account/subscribe/${accountId}`
    );
  }

  getSubscriptions() {
    return this.http.get<Pageble<Profile>>(
      `${BASE_API_URL}account/subscriptions/`
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
