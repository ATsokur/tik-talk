import { createActionGroup, props } from '@ngrx/store';
import { Profile } from '../profile.interface';

/**
 * source должен быть уникальной строкой
 * props - метод с описанием типа данных, который он ожидает
 */
export const profileActions = createActionGroup({
  source: 'profile',
  events: {
    'filter events': props<{
      filters: Record<string, any>;
    }>(),
    'profiles loaded': props<{ profiles: Profile[] }>()
  }
});
