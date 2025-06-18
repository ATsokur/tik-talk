import { Route } from '@angular/router';
import { ExperimentalLayoutComponent } from './experimental-layout/experimental-layout.component';
import { FormExperimentalComponent } from '../feature-form-experimental';
import { HomeTaskFormComponent } from '../feature-home-task-form';

export const experimentalRoutes: Route[] = [
  {
    path: '',
    component: ExperimentalLayoutComponent,
    children: [
      {
        path: 'form-experimental',
        component: FormExperimentalComponent
      },
      {
        path: 'home-task-form',
        component: HomeTaskFormComponent
      }
    ]
  }
];
