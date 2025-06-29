import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Profile } from '../profile.interface';

/**
 * source должен быть уникальной строкой
 * props - метод с описанием типа данных, который он ожидает
 * В props поле объекта, которое является payload и мы можем этот payload получить в reducer и обновить state
 */
export const profileActions = createActionGroup({
  source: 'profile',
  events: {
    'fetch me': emptyProps(),
    'me loaded': props<{ me: Profile | null }>(),
    'fetch account': props<{ id: number }>(),
    'account loaded': props<{ account: Profile | null }>(),
    'filter events': props<{
      filters: Record<string, any>;
    }>(),
    'profiles loaded': props<{ profiles: Profile[] }>(),
    'fetch subscribers': props<{ amount: number }>(),
    'subscribers loaded': props<{ subscribers: Profile[] }>(),

    'patch profile': props<{ profile: Partial<Profile> }>(),
    'save settings': emptyProps(),
    'upload avatar': props<{ file: File }>()
  }
});
