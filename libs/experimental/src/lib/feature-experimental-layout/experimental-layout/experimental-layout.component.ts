import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-experimental-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './experimental-layout.component.html',
  styleUrl: './experimental-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExperimentalLayoutComponent {
  public readonly menuItems = [
    {
      title: 'Experimental Form',
      link: 'form-experimental'
    },
    {
      title: 'Home Task Form',
      link: 'home-task-form'
    }
  ];
}
