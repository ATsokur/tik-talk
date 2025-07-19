import { createSelector } from '@ngrx/store';
import { profileFeature, ProfileState } from './reducer';
import { Profile } from '../profile.interface';

/**
 * Получение данных из store
 * Получаем reducer (profileFeature) и забираем profiles из state, которые reducer вернул
 * Возвращаемые profiles можно как-либо видоизменить перед тем, как они попадут в компонент.
 * 1, 2 ... n аргументом можно передавать разные selectors
 * В callbackFn будут аргументы с данными от переданных selectors
 */
export const selectFilteredProfiles = createSelector(
  profileFeature.selectProfiles,
  profileFeature.selectProfileFilters,
  (profiles: Profile[], filters: Record<string, any>) => {
    return {
      profiles,
      filters
    };
  }
);

export const selectProfilePageable = createSelector(
  profileFeature.selectProfileFeatureState,
  (state: ProfileState) => {
    return {
      page: state.page,
      size: state.size
    };
  }
);

export const selectProfileFilters = createSelector(
  profileFeature.selectProfileFilters,
  (filters: Record<string, any>) => filters
);

export const selectMe = createSelector(
  profileFeature.selectMe,
  (me: Profile | null) => {
    return me;
  }
);

export const selectAccount = createSelector(
  profileFeature.selectAccount,
  (profile: Profile | null) => {
    return profile;
  }
);

export const selectMySubscribers = createSelector(
  profileFeature.selectMySubscribers,
  (mySubscribers: Profile[]) => {
    return mySubscribers;
  }
);

export const selectSubscribersById = createSelector(
  profileFeature.selectSubscribersById,
  (subscribersById: Profile[]) => {
    return subscribersById;
  }
);

export const selectMySubscriptions = createSelector(
  profileFeature.selectMySubscriptions,
  (mySubscriptions: Profile[]) => {
    return mySubscriptions;
  }
);
