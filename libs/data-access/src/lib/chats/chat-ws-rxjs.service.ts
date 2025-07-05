import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import {
  ChatConnectionWSPrams,
  ChatWSService
} from './chat-ws-service.interface';
import { ChatWSMessage } from './chat-ws-message.interface';
import { finalize, Observable, tap } from 'rxjs';

export class ChatWsRxjsService implements ChatWSService {
  #socket: WebSocketSubject<ChatWSMessage> | null = null;
  isDisconnected = false;

  connect(params: ChatConnectionWSPrams): Observable<ChatWSMessage> {
    if (!this.#socket || this.isDisconnected) {
      this.#socket = webSocket({
        url: params.url,
        protocol: [params.token]
      });
      console.log('Го, я создал');
    }

    return this.#socket.asObservable().pipe(
      tap((message) => params.handleMessage(message)),
      finalize(() => console.log('Закрытие сокета'))
    );
  }

  sendMessage(text: string, chatId: number): void {
    this.#socket?.next({
      text,
      chat_id: chatId
    });
  }

  disconnect(): void {
    this.#socket?.complete();
    this.isDisconnected = true;
  }
}
