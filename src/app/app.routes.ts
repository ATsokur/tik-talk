import { Routes } from '@angular/router';

import { canActivateAuth } from './auth/access.guard';
import { LayoutComponent } from './common-ui/layout/layout.component';
import { chatsRouters } from './pages/chats-page/chats.routes';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
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
