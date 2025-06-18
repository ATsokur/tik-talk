import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { map, tap } from 'rxjs';

import { BASE_API_URL, GlobalStoreService } from '@tt/shared';
import { Pageble } from '@tt/shared';
import { Profile } from '@tt/interfaces/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  #globalStoreService = inject(GlobalStoreService);
  public me = signal<Profile | null>(null);
  public filteredProfiles = signal<Profile[]>([]);

  getTestAccounts() {
    return this.http.get<Profile[]>(`${BASE_API_URL}account/test_accounts`);
  }

  getMe() {
    return this.http.get<Profile>(`${BASE_API_URL}account/me`).pipe(
      tap((res) => {
        this.me.set(res);
        this.#globalStoreService.me.set(res);
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

  filterProfiles(params: Record<string, any>) {
    return this.http
      .get<Pageble<Profile>>(`${BASE_API_URL}account/accounts`, {
        params
      })
      .pipe(tap((res) => this.filteredProfiles.set(res.items)));
  }
}
