import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { map, Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { BASE_API_URL } from '@tt/shared';

import { selectMe } from '../profile';
import { ChatWSMessage } from './chat-ws-message.interface';
import { ChatWsRxjsService } from './chat-ws-rxjs.service';
import { ChatWSService } from './chat-ws-service.interface';
import { Chat, LastMessageResponse, Message } from './chats.interface';
import { groupMessagesByDay, updateActiveChatMessages } from './helpers';
import { isNewMessage, isUnreadMessage } from './type-guards';
import { AuthService } from '../auth';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  private readonly http = inject(HttpClient);
  #store = inject(Store);
  #authService = inject(AuthService);
  private readonly me = this.#store.selectSignal(selectMe);
  private readonly chatById = signal<Chat | null>(null);
  public activeChatMessages = signal<Message[][]>([]);
  public amountUnreadMessages = signal<number>(0);

  private readonly chatsUrl: string = `${BASE_API_URL}chat/`;
  private readonly messageUrl: string = `${BASE_API_URL}message/`;

  wsAdapter: ChatWSService = new ChatWsRxjsService();

  connectWS() {
    return this.wsAdapter.connect({
      url: `${BASE_API_URL}chat/ws`,
      token: this.#authService.token ?? '',
      handleMessage: this.handleWSMessage
    }) as Observable<ChatWSMessage>;
  }

  handleWSMessage = (message: ChatWSMessage) => {
    if (!('action' in message)) return;

    if (isUnreadMessage(message)) {
      this.amountUnreadMessages.set(message.data.count);
    }

    if (isNewMessage(message)) {
      const me = this.me();
      const chatById = this.chatById();

      if (!me || !chatById) return;

      this.activeChatMessages.update((activeMessages) => {
        return updateActiveChatMessages(activeMessages, message, me, chatById);
      });
    }
  };

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
            isMine: message.userFromId === this.me()?.id
          };
        });

        this.activeChatMessages.set(groupMessagesByDay(patchedMessages));
        const chatById = {
          ...chat,
          companion:
            chat.userFirst.id === this.me()?.id
              ? chat.userSecond
              : chat.userFirst,
          messages: patchedMessages
        };
        this.chatById.set(chatById);
        return chatById;
      })
    );
  }

  sendMessage(chatId: number, message: string) {
    return this.http.post<Message>(
      `${this.messageUrl}send/${chatId}`,
      {},
      {
        params: {
          message
        }
      }
    );
  }
}
