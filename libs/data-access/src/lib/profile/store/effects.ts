import { inject, Injectable } from '@angular/core';
import { ProfileService } from '../profile.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { profileActions } from './actions';
import { map, switchMap } from 'rxjs';

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
}
