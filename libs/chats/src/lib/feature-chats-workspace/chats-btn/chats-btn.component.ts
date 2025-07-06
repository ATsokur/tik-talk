import { Component, input } from '@angular/core';

import { AvatarCircleComponent, TtDatePipe } from '@tt/common-ui';
import { LastMessageResponse } from '@tt/data-access';

@Component({
  selector: 'button[chats]',
  imports: [AvatarCircleComponent, TtDatePipe],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss'
})
export class ChatsBtnComponent {
  public chat = input<LastMessageResponse>();
  public isRead = input<number>();
}
