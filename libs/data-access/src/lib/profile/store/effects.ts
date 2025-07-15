import { inject, Injectable } from '@angular/core';

import { filter, map, switchMap, withLatestFrom } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { Profile } from '../profile.interface';
import { ProfileService } from '../profile.service';
import { profileActions } from './actions';
import { selectFilteredProfiles, selectMySubscriptions } from './selectors';

@Injectable({
  providedIn: 'root'
})
export class ProfileEffects {
  #profileService = inject(ProfileService);
  #store = inject(Store);
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

  filterProfilesWithSubscriptions = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        profileActions.profilesLoaded,
        profileActions.mySubscriptionsLoaded
      ),
      withLatestFrom(
        this.#store.select(selectMySubscriptions),
        this.#store.select(selectFilteredProfiles)
      ),
      filter(
        ([, subscriptions, profiles]) =>
          !!Object.values(profiles.profiles).length && !!subscriptions.length
      ),
      map(([, subscriptions, profiles]) => {
        const subs = subscriptions.reduce(
          (acc: Record<string, Profile>, profile) => {
            acc[profile.id] = profile;
            return acc;
          },
          {}
        );
        const resProfiles = profiles.profiles.map((profile) => {
          if (subs[profile.id]) {
            return {
              ...profile,
              isSubscription: true
            };
          }
          return {
            ...profile,
            isSubscription: false
          };
        });
        return profileActions.profilesWithSubscriptionsLoaded({
          profiles: resProfiles
        });
      })
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
      ofType(profileActions.fetchMySubscribers),
      switchMap(({ amount }) => {
        return this.#profileService.getSubscribersShortList(amount);
      }),
      map((mySubscribers) =>
        profileActions.mySubscribersLoaded({ mySubscribers })
      )
    );
  });

  fetchSubscribersById = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.fetchSubscribersById),
      switchMap(({ amount, accountId }) => {
        return this.#profileService.getSubscribersShortListById(
          amount,
          accountId
        );
      }),
      map((subscribersById) =>
        profileActions.subscribersByIdLoaded({ subscribersById })
      )
    );
  });

  fetchMySubscriptions = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.fetchMySubscriptions),
      switchMap(() => {
        return this.#profileService.getSubscriptions();
      }),
      map(({ items }) =>
        profileActions.mySubscriptionsLoaded({ mySubscriptions: items })
      )
    );
  });

  toSubscribe = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.toSubscribe),
      switchMap(({ accountId }) => {
        return this.#profileService.toSubscribe(accountId);
      }),
      map(() => profileActions.fetchMySubscriptions())
    );
  });

  toUnsubscribe = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.toUnsubscribe),
      switchMap(({ accountId }) => {
        return this.#profileService.toUnsubscribe(accountId);
      }),
      map(() => profileActions.fetchMySubscriptions())
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
