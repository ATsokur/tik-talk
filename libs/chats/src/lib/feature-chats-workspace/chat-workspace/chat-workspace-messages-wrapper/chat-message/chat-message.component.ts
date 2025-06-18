import { Component, HostBinding, input } from '@angular/core';

import { AvatarCircleComponent, TtDatePipe } from '@tt/common-ui';
import { Message } from '../../../../data';

@Component({
  selector: 'app-chat-message',
  imports: [AvatarCircleComponent, TtDatePipe],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
})
export class ChatMessageComponent {
  public message = input.required<Message>();

  @HostBinding('class.is-mine')
  get isMine() {
    return this.message().isMine;
  }
}
