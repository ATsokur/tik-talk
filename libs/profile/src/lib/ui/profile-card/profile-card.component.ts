import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  input,
  Input,
  Output
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { ImgUrlPipe, SvgIconComponent } from '@tt/common-ui';
import { Profile } from '@tt/data-access';

@Component({
  selector: 'app-profile-card',
  imports: [ImgUrlPipe, SvgIconComponent, RouterLink],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileCardComponent {
  @Input() profile!: Profile;
  @Output() chatted = new EventEmitter<number>();
  @Output() subscriptionCreated = new EventEmitter<number>();
  @Output() subscriptionDeleted = new EventEmitter<number>();
  isSubscribed = input<boolean>();
  me = input<Profile | null>();

  toSubscribe(accountId: number) {
    this.subscriptionCreated.emit(accountId);
  }

  toUnsubscribe(accountId: number) {
    this.subscriptionDeleted.emit(accountId);
  }

  toChat(profileId: number) {
    this.chatted.emit(profileId);
  }
}
