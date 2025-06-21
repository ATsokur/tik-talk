import { createFeature, createReducer, on } from '@ngrx/store';
import { Profile } from '../profile.interface';
import { profileActions } from './actions';

export interface ProfileState {
  profiles: Profile[];
  profileFilters: Record<string, any>;
}

export const initialState: ProfileState = {
  profiles: [],
  profileFilters: {}
};

/**
 * name должен быть уникальной строкой
 * Сторы могут быть как глобальными, так и для отдельной feature
 * Для отдельной feature (сейчас это profile) создали reducer
 * Все последующие reducers будут on(action_name, callbackFn(state,payload)) Прописываются через запятую после initialState
 * on() как eventListener. 1 аргумент - название события, 2 аргумент - что необходимо сделать.
 * из фун-ии reducer мы должны вернуть новое значение всего state
 * profiles: payload.profiles запрашиваем на сервере
 * on() return актуальный state
 */
export const profileFeature = createFeature({
  name: 'profileFeature',
  reducer: createReducer(
    initialState,
    on(profileActions.profilesLoaded, (state, payload) => {
      return {
        ...state,
        profiles: payload.profiles
      };
    }),
    on(profileActions.filterEvents, (state, payload) => {
      return {
        ...state,
        profileFilters: payload.filters
      };
    })
  )
});
