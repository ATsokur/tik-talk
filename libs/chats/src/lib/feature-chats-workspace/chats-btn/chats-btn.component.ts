import { Component, input } from '@angular/core';

import { AvatarCircleComponent, TtDatePipe } from '@tt/common-ui';
import { LastMessageResponse } from '../../data';

@Component({
  selector: 'button[chats]',
  imports: [AvatarCircleComponent, TtDatePipe],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss',
})
export class ChatsBtnComponent {
  public chat = input<LastMessageResponse>();
}
