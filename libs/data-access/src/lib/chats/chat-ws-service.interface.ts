import { Observable } from 'rxjs';
import { ChatWSMessage } from './chat-ws-message.interface';

export interface ChatConnectionWSPrams {
  url: string;
  token: string;
  handleMessage: (message: ChatWSMessage) => void;
}

export interface ChatWSService {
  connect: (params: ChatConnectionWSPrams) => void | Observable<ChatWSMessage>;
  sendMessage: (text: string, chatId: number) => void;
  disconnect: () => void;
}
