import { Component, inject } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';

@Component({
  selector: 'app-experimental-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './experimental-layout.component.html',
  styleUrl: './experimental-layout.component.scss',
})
export class ExperimentalLayoutComponent {
  public readonly menuItems = [
    {
      title: 'Experimental Form',
      link: 'form-experimental',
    },
    {
      title: 'Home Task Form',
      link: 'home-task-form',
    },
  ];
}
