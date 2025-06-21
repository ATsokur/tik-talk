import { createSelector } from '@ngrx/store';
import { profileFeature } from './reducer';
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
