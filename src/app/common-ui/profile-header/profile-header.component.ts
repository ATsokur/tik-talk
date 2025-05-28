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
  public isMyPage = input<boolean>();
  public profile = input<Profile>();
}
