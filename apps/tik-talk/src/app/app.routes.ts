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
        component: SearchPageComponent
      },
      {
        path: 'profile/:id',
        component: ProfilePageComponent
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
