import {
  toFormatDate,
  toISO
} from '@tt/shared';

import { Profile } from '../../profile';
import { ChatWSNewMessage } from '../chat-ws-message.interface';
import {
  Chat,
  Message
} from '../chats.interface';

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

  const lastMessage = {
    id: message.data.id,
    userFromId: message.data.author,
    personalChatId: message.data.chat_id,
    text: message.data.message,
    createdAt: toISO(message.data.created_at) ?? '',
    user: message.data.author === me?.id ? me : chatById?.companion,
    isRead: false,
    isMine: false
  };
  if (lastMessageGroupDate === currentMessageDate) {
    lastMessageGroup.push(lastMessage);
    activeMessages.pop();
    return [...activeMessages, lastMessageGroup];
  }

  if (lastMessageGroupDate !== currentMessageDate) {
    activeMessages.push([lastMessage]);
    return [...activeMessages];
  }
  return [];
};
