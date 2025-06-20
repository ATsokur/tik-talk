import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  auditTime,
  firstValueFrom,
  fromEvent,
  skip,
  Subscription,
  switchMap,
  timer,
} from 'rxjs';

import { TtDatePipe } from '@tt/common-ui';
import { ChatMessageComponent } from './chat-message/chat-message.component';

import { Chat, ChatsService } from '../../../data';
import { MessageInputComponent } from '../../../ui';

@Component({
  selector: 'app-chat-messages-wrapper',
  imports: [ChatMessageComponent, MessageInputComponent, TtDatePipe],
  templateUrl: './chat-messages-wrapper.component.html',
  styleUrl: './chat-messages-wrapper.component.scss',
})
export class ChatMessagesWrapperComponent implements AfterViewInit, OnDestroy {
  private readonly chatsService = inject(ChatsService);
  private readonly r2 = inject(Renderer2);
  private resizeSubscription!: Subscription;
  public chat = input.required<Chat>();
  public messagesGroupedByDay = this.chatsService.activeChatMessages;

  @ViewChild('messagesWrapper')
  messagesWrapperElement!: ElementRef<HTMLDivElement>;

  constructor() {
    timer(0, 300000)
      .pipe(
        skip(1),
        switchMap(() => {
          return this.chatsService.getChatById(this.chat().id);
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  onScrollDown() {
    this.messagesWrapperElement.nativeElement.scrollTo(
      0,
      this.messagesWrapperElement.nativeElement.scrollHeight
    );
  }

  async onSendMessage(messageText: string) {
    await firstValueFrom(
      this.chatsService.sendMessage(this.chat().id, messageText)
    );
    await firstValueFrom(this.chatsService.getChatById(this.chat().id));
  }

  resizeMessageWrapper() {
    const { top } =
      this.messagesWrapperElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 70 - 70;
    this.r2.setStyle(
      this.messagesWrapperElement.nativeElement,
      'max-height',
      `${height}px`
    );
  }

  ngAfterViewInit(): void {
    this.resizeMessageWrapper();
    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(auditTime(300))
      .subscribe(() => this.resizeMessageWrapper());
    this.onScrollDown();
  }

  ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe();
  }
}
