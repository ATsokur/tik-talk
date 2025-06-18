import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { map } from 'rxjs';

import {
  Chat,
  LastMessageResponse,
  Message,
} from '../interfaces/chats.interface';

import { BASE_API_URL, GlobalStoreService } from '@tt/shared';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  private readonly http = inject(HttpClient);
  private readonly me = inject(GlobalStoreService).me;

  private readonly chatsUrl: string = `${BASE_API_URL}chat/`;
  private readonly messageUrl: string = `${BASE_API_URL}message/`;

  public activeChatMessages = signal<Message[][]>([]);

  createChat(userId: number) {
    return this.http.post<Chat>(`${this.chatsUrl}${userId}`, {});
  }

  getMyChats() {
    return this.http.get<LastMessageResponse[]>(
      `${this.chatsUrl}get_my_chats/`
    );
  }

  getChatById(chatId: number) {
    return this.http.get<Chat>(`${this.chatsUrl}${chatId}`).pipe(
      map((chat) => {
        const patchedMessages = chat.messages.map((message) => {
          return {
            ...message,
            user:
              chat.userFirst.id === message.userFromId
                ? chat.userFirst
                : chat.userSecond,
            isMine: message.userFromId === this.me()!.id,
          };
        });

        const groupMessagesByDay = (messages: Message[]): Message[][] => {
          if (!messages.length) return [];

          const messagesGroupedByDay: Message[][] = [];
          let messagesGrouped: Message[] = [];

          let messageDay = DateTime.fromISO(messages[0].createdAt).day;
          let currentMessageDay;

          for (let i = 0; i < messages.length; i++) {
            currentMessageDay = DateTime.fromISO(messages[i].createdAt).day;

            if (messageDay === currentMessageDay) {
              messagesGrouped.push(messages[i]);
            } else {
              messagesGroupedByDay.push(messagesGrouped);
              messagesGrouped = [];
              messagesGrouped.push(messages[i]);
              messageDay = DateTime.fromISO(messages[i].createdAt).day;
            }
          }

          messagesGroupedByDay.push(messagesGrouped);

          return messagesGroupedByDay;
        };

        this.activeChatMessages.set(groupMessagesByDay(patchedMessages));

        return {
          ...chat,
          companion:
            chat.userFirst.id === this.me()?.id
              ? chat.userSecond
              : chat.userFirst,
          messages: patchedMessages,
        };
      })
    );
  }

  sendMessage(chatId: number, message: string) {
    return this.http.post<Message>(
      `${this.messageUrl}send/${chatId}`,
      {},
      {
        params: {
          message,
        },
      }
    );
  }
}
