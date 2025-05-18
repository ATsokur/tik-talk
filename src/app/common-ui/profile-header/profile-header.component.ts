import { Component, Input, input } from '@angular/core';

import { Profile } from '../../data/interfaces/profile.interface';
import { AvatarCircleComponent } from '../avatar-circle/avatar-circle.component';

@Component({
  selector: 'app-profile-header',
  imports: [AvatarCircleComponent],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss',
})
export class ProfileHeaderComponent {
  @Input() routeParamId: string | undefined;
  public profile = input<Profile>();
}
