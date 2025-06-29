import { Routes } from '@angular/router';

import { canActivateAuth, LoginPageComponent } from '@tt/auth';
import { LayoutComponent } from '@tt/layout';
import { chatsRouters } from '@tt/chats';
import {
  ProfilePageComponent,
  SearchPageComponent,
  SettingsPageComponent
} from '@tt/profile';
import { experimentalRoutes } from '@tt/experimental';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import {
  PostsEffects,
  postsFeature,
  ProfileEffects,
  profileFeature
} from '@tt/data-access';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'profile/me',
        pathMatch: 'full'
      },
      {
        path: 'chats',
        loadChildren: () => chatsRouters
      },
      {
        path: 'search',
        component: SearchPageComponent,
        providers: [
          provideState(profileFeature),
          provideEffects(ProfileEffects)
        ]
      },
      {
        path: 'profile/:id',
        component: ProfilePageComponent,
        providers: [
          provideState(profileFeature),
          provideEffects(ProfileEffects),
          provideState(postsFeature),
          provideEffects(PostsEffects)
        ]
      },
      {
        path: 'settings',
        component: SettingsPageComponent
      },
      {
        path: 'experimental',
        loadChildren: () => experimentalRoutes
      }
    ],
    canActivate: [canActivateAuth]
  },
  {
    path: 'login',
    component: LoginPageComponent
  }
];
