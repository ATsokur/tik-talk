import { Component, input } from '@angular/core';

import { AvatarCircleComponent } from '../../../common-ui/avatar-circle/avatar-circle.component';
import { LastMessageResponse } from '../../../data/interfaces/chats.interface';
import { TtDatePipe } from '../../../helpers/pipes/tt-date.pipe';

@Component({
  selector: 'button[chats]',
  imports: [AvatarCircleComponent, TtDatePipe],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss',
})
export class ChatsBtnComponent {
  public chat = input<LastMessageResponse>();
}
