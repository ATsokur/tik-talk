import {
  ChatConnectionWSPrams,
  ChatWSService
} from './chat-ws-service.interface';

export class ChatWSNativeService implements ChatWSService {
  #socket: WebSocket | null = null;

  connect(params: ChatConnectionWSPrams) {
    if (this.#socket) return;
    this.#socket = new WebSocket(params.url, [params.token]);

    /**
     * Если мы не зададим в chatService для фун-ии handleMessage this через bind
     * или не сделаем handleMessage стрелочной фун-ией, то она потеряет контекст.
     * А точнее params будет в данном случае являться this для handleMessage,
     * так как у params нет this.activeChatMessages, то будет ошибка, потому что
     * он попытается вызвать метод у несуществующего сигнала
     */
    this.#socket.onmessage = (event: MessageEvent) => {
      params.handleMessage(JSON.parse(event.data));
    };

    this.#socket.onclose = () => {
      console.log('Закрытие сокета');
    };
  }

  sendMessage(text: string, chatId: number) {
    this.#socket?.send(
      JSON.stringify({
        text,
        chat_id: chatId
      })
    );
  }

  disconnect() {
    this.#socket?.close();
  }
}
