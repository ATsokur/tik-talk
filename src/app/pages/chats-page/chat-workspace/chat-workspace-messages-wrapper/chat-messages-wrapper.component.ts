import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  Renderer2,
} from '@angular/core';

import { auditTime, firstValueFrom, fromEvent, Subscription } from 'rxjs';

import { MessageInputComponent } from '../../../../common-ui/message-input/message-input.component';
import { Chat } from '../../../../data/interfaces/chats.interface';
import { ChatsService } from '../../../../data/services/chats.service';
import { ChatMessageComponent } from './chat-message/chat-message.component';

@Component({
  selector: 'app-chat-messages-wrapper',
  imports: [ChatMessageComponent, MessageInputComponent],
  templateUrl: './chat-messages-wrapper.component.html',
  styleUrl: './chat-messages-wrapper.component.scss',
})
export class ChatMessagesWrapperComponent implements AfterViewInit, OnDestroy {
  private readonly chatsService = inject(ChatsService);
  private readonly r2 = inject(Renderer2);
  private readonly hostElement = inject(ElementRef);
  private subscription!: Subscription;
  public chat = input.required<Chat>();
  public messages = this.chatsService.activeChatMessages;

  async onSendMessage(messageText: string) {
    await firstValueFrom(
      this.chatsService.sendMessage(this.chat().id, messageText)
    );
    await firstValueFrom(this.chatsService.getChatById(this.chat().id));
  }

  resizeMessageWrapper() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 12 - 12;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  ngAfterViewInit(): void {
    this.resizeMessageWrapper();
    this.subscription = fromEvent(window, 'resize')
      .pipe(auditTime(300))
      .subscribe(() => this.resizeMessageWrapper());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
