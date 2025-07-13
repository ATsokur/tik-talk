import { Chat, LastMessageResponse, Message } from './chats.interface';
import { ChatsService } from './chats.service';
import { isErrorMessage, isNewMessage, isUnreadMessage } from './type-guards';

export type { Chat, Message, LastMessageResponse };
export { ChatsService, isUnreadMessage, isNewMessage, isErrorMessage };
