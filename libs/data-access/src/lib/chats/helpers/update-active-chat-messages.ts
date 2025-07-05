import { toFormatDate, toISO } from '@tt/shared';
import { Chat, Message } from '../chats.interface';
import { Profile } from '../../profile';
import { ChatWSNewMessage } from '../chat-ws-message.interface';

export const updateActiveChatMessages = (
  activeMessages: Message[][],
  message: ChatWSNewMessage,
  me: Profile | null,
  chatById: Chat | null
): Message[][] => {
  const lastMessageGroup = activeMessages.slice(-1).flat();
  const lastMessageGroupDate = toFormatDate(
    lastMessageGroup[lastMessageGroup.length - 1].createdAt
  );
  const currentMessageDate = toFormatDate(message.data.created_at);
  if (lastMessageGroupDate === currentMessageDate) {
    if (message.data.author === me?.id) {
      lastMessageGroup.push({
        id: message.data.id,
        userFromId: message.data.author,
        personalChatId: message.data.chat_id,
        text: message.data.message,
        createdAt: toISO(message.data.created_at) ?? '',
        user: me ?? undefined,
        isRead: false,
        isMine: false
      });
    } else {
      lastMessageGroup.push({
        id: message.data.id,
        userFromId: message.data.author,
        personalChatId: message.data.chat_id,
        text: message.data.message,
        createdAt: toISO(message.data.created_at) ?? '',
        user: chatById?.companion ?? undefined,
        isRead: false,
        isMine: false
      });
    }
    activeMessages.pop();
    return [...activeMessages, lastMessageGroup];
  }

  if (lastMessageGroupDate !== currentMessageDate) {
    activeMessages.push([
      {
        id: message.data.id,
        userFromId: message.data.author,
        personalChatId: message.data.chat_id,
        text: message.data.message,
        createdAt: message.data.created_at,
        isRead: false,
        isMine: false
      }
    ]);
    return [...activeMessages];
  }
  return [];
};
