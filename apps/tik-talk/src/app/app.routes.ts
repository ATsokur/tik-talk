import { Routes } from '@angular/router';

import { canActivateAuth, LoginPageComponent } from '@tt/auth';
import { LayoutComponent } from '@tt/layout';
import { chatsRouters } from '@tt/chats';
import {
  ProfilePageComponent,
  SearchPageComponent,
  SettingsPageComponent,
} from '@tt/profile';
import { ExperimentalLayoutComponent } from './experimental/components/experimental-layout/experimental-layout.component';
import { FormExperimentalComponent } from './experimental/components/form-experimental/form-experimental.component';
import { HomeTaskFormComponent } from './experimental/components/home-task-form/home-task-form.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'profile/me',
        pathMatch: 'full',
      },
      {
        path: 'chats',
        loadChildren: () => chatsRouters,
      },
      {
        path: 'search',
        component: SearchPageComponent,
      },
      {
        path: 'profile/:id',
        component: ProfilePageComponent,
      },
      {
        path: 'settings',
        component: SettingsPageComponent,
      },
      {
        path: 'experimental',
        component: ExperimentalLayoutComponent,
        children: [
          {
            path: 'form-experimental',
            component: FormExperimentalComponent,
          },
          {
            path: 'home-task-form',
            component: HomeTaskFormComponent,
          },
        ],
      },
    ],
    canActivate: [canActivateAuth],
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },
];
