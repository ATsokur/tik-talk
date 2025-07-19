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
    'set page': props<{ page?: number }>(),
    'profiles loaded': props<{ profiles: Profile[] }>(),

    'fetch my subscribers': props<{ amount: number }>(),
    'my subscribers loaded': props<{ mySubscribers: Profile[] }>(),
    'fetch subscribers by id': props<{ amount: number; accountId: number }>(),
    'subscribers by id loaded': props<{ subscribersById: Profile[] }>(),

    'fetch my subscriptions': emptyProps(),
    'my subscriptions loaded': props<{ mySubscriptions: Profile[] }>(),
    'to subscribe': props<{ accountId: number }>(),
    'to unsubscribe': props<{ accountId: number }>(),
    'profiles with subscriptions loaded': props<{ profiles: Profile[] }>(),

    'patch profile': props<{ profile: Partial<Profile> }>(),
    'save avatar': emptyProps(),
    'upload avatar': props<{ file: File }>()
  }
});
