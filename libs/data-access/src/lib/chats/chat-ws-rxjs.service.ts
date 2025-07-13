import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import {
  ChatConnectionWSPrams,
  ChatWSService
} from './chat-ws-service.interface';
import { ChatWSMessage } from './chat-ws-message.interface';
import { finalize, Observable, tap } from 'rxjs';
import { AuthService } from '../auth';
import { inject } from '@angular/core';

export class ChatWsRxjsService implements ChatWSService {
  #socket: WebSocketSubject<ChatWSMessage> | null = null;
  #authService = inject(AuthService);

  connect(params: ChatConnectionWSPrams): Observable<ChatWSMessage> {
    if (!this.#socket) {
      this.#socket = webSocket({
        url: params.url,
        protocol: [params.token]
      });
    }

    return this.#socket.asObservable().pipe(
      tap((message) => params.handleMessage(message)),
      finalize(() => {
        console.log('Закрытие сокета');
        this.#handleSocketClose(params);
      })
    );
  }

  sendMessage(text: string, chatId: number): void {
    this.#socket?.next({
      text,
      chat_id: chatId
    });
  }

  disconnect() {
    this.#socket?.complete();
  }

  #handleSocketClose(params: ChatConnectionWSPrams) {
    if (this.#authService.token) {
      console.log('try to connect');
      this.disconnect();
      this.#socket = null;
      this.connect({
        url: params.url,
        token: this.#authService.token,
        handleMessage: params.handleMessage
      });
    }
  }
}
