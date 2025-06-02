import { Component, HostBinding, input } from '@angular/core';

import { AvatarCircleComponent } from '../../../../../common-ui/avatar-circle/avatar-circle.component';
import { Message } from '../../../../../data/interfaces/chats.interface';
import { TtDatePipe } from '../../../../../helpers/pipes/tt-date.pipe';

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
