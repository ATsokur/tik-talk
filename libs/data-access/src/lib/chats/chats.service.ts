import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { map, Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { BASE_API_URL } from '@tt/shared';

import { AuthService } from '../auth';
import { selectMe } from '../profile';
import { ChatWSMessage } from './chat-ws-message.interface';
import { ChatWsRxjsService } from './chat-ws-rxjs.service';
import { ChatWSService } from './chat-ws-service.interface';
import { Chat, LastMessageResponse, Message } from './chats.interface';
import { groupMessagesByDay, updateActiveChatMessages } from './helpers';
import { isNewMessage, isUnreadMessage } from './type-guards';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  private readonly http = inject(HttpClient);
  #store = inject(Store);
  #authService = inject(AuthService);
  private readonly me = this.#store.selectSignal(selectMe);
  private readonly chatById = signal<Chat | null>(null);

  private readonly chatsUrl: string = `${BASE_API_URL}chat/`;
  private readonly messageUrl: string = `${BASE_API_URL}message/`;

  wsAdapter: ChatWSService = new ChatWsRxjsService();

  public activeChatMessages = signal<Message[][]>([]);

  //TODO Token протухнет. Нужно закрыть соединение и открыть с новым token
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
      //TODO ДЗ. Вынести в app.component
    }

    if (isNewMessage(message)) {
      this.activeChatMessages.update((activeMessages) => {
        return updateActiveChatMessages(
          activeMessages,
          message,
          this.me(),
          this.chatById()
        );
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
            isMine: message.userFromId === this.me()!.id
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
