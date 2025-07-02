import { inject, Injectable } from '@angular/core';

import { map, switchMap } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { ProfileService } from '../profile.service';
import { profileActions } from './actions';

@Injectable({
  providedIn: 'root'
})
export class ProfileEffects {
  #profileService = inject(ProfileService);
  actions$ = inject(Actions);

  /**
   * Когда произойдет profileActions.filterEvents, то этот effect сработает
   * Мы можем после action сделать запрос на бэк
   * Получаем payload (поле filters) и делаем запрос на бэк
   * Получили profiles и загрузили в props action
   * effect -> action -> request on server -> other action
   */
  filterProfiles = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.filterEvents),
      switchMap(({ filters }) => {
        return this.#profileService.filterProfiles(filters);
      }),
      map((res) => profileActions.profilesLoaded({ profiles: res.items }))
    );
  });

  fetchMe = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.fetchMe),
      switchMap(() => {
        return this.#profileService.getMe();
      }),
      map((me) => profileActions.meLoaded({ me }))
    );
  });

  fetchAccount = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.fetchAccount),
      switchMap(({ id }) => {
        return this.#profileService.getAccount(String(id));
      }),
      map((account) => profileActions.accountLoaded({ account }))
    );
  });

  fetchSubscribers = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.fetchSubscribers),
      switchMap(({ amount }) => {
        return this.#profileService.getSubscribersShortList(amount);
      }),
      map((subscribers) => profileActions.subscribersLoaded({ subscribers }))
    );
  });

  patchProfile = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.patchProfile),
      switchMap(({ profile }) => {
        return this.#profileService.patchProfile(profile);
      }),
      map(() => profileActions.fetchMe())
    );
  });

  uploadAvatar = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.uploadAvatar),
      switchMap(({ file }) => {
        return this.#profileService.uploadAvatar(file);
      }),
      map(() => profileActions.saveAvatar())
    );
  });
}
