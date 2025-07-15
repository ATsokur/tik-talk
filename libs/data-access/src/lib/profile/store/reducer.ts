import { createFeature, createReducer, on } from '@ngrx/store';
import { Profile } from '../profile.interface';
import { profileActions } from './actions';

export interface ProfileState {
  profiles: Profile[];
  profileFilters: Record<string, any>;
  me: Profile | null;
  account: Profile | null;
  mySubscribers: Profile[];
  subscribersById: Profile[];
  mySubscriptions: Profile[];
}

const initialState: ProfileState = {
  profiles: [],
  profileFilters: {},
  me: null,
  account: null,
  mySubscribers: [],
  subscribersById: [],
  mySubscriptions: []
};

/**
 * name должен быть уникальной строкой
 * Сторы могут быть как глобальными, так и для отдельной feature
 * Для отдельной feature (сейчас это profile) создали reducer
 * Все последующие reducers будут on(action_name, callbackFn(state,payload)) Прописываются через запятую после initialState
 * on() как eventListener. 1 аргумент - название события, 2 аргумент - что необходимо сделать.
 * из фун-ии reducer мы должны вернуть новое значение всего state
 * payload (actionPayload) - данные, которые мы передали в action
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
    on(profileActions.profilesWithSubscriptionsLoaded, (state, payload) => {
      return {
        ...state,
        profiles: payload.profiles
      };
    }),
    on(profileActions.filterEvents, (state, { filters }) => {
      return {
        ...state,
        profileFilters: filters
      };
    }),
    on(profileActions.meLoaded, (state, { me }) => {
      return {
        ...state,
        me
      };
    }),
    on(profileActions.accountLoaded, (state, { account }) => {
      return {
        ...state,
        account
      };
    }),
    on(profileActions.mySubscribersLoaded, (state, { mySubscribers }) => {
      return {
        ...state,
        mySubscribers
      };
    }),
    on(profileActions.subscribersByIdLoaded, (state, { subscribersById }) => {
      return {
        ...state,
        subscribersById
      };
    }),
    on(profileActions.mySubscriptionsLoaded, (state, { mySubscriptions }) => {
      return {
        ...state,
        mySubscriptions
      };
    })
  )
});
