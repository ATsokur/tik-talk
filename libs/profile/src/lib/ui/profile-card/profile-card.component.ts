import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ImgUrlPipe, SvgIconComponent } from '@tt/common-ui';
import { Profile } from '@tt/data-access';

@Component({
  selector: 'app-profile-card',
  imports: [ImgUrlPipe, SvgIconComponent, RouterLink],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss'
})
export class ProfileCardComponent {
  @Input() profile!: Profile;
  @Output() chat = new EventEmitter<number>();
  isSubscribed = signal<boolean>(false);

  toSubscribe() {
    this.isSubscribed.update((value) => !value);
  }

  toChat(profileId: number) {
    this.chat.emit(profileId);
  }
}
