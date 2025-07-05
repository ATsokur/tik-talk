import { toFormatDate } from '@tt/shared';
import { Message } from '../chats.interface';

export const groupMessagesByDay = (messages: Message[]): Message[][] => {
  if (!messages.length) return [];

  const messagesGroupedByDay: Message[][] = [];
  let messagesGrouped: Message[] = [];

  let messageDay = toFormatDate(messages[0].createdAt);
  let currentMessageDay;

  for (let i = 0; i < messages.length; i++) {
    currentMessageDay = toFormatDate(messages[i].createdAt);

    if (messageDay === currentMessageDay) {
      messagesGrouped.push(messages[i]);
    } else {
      messagesGroupedByDay.push(messagesGrouped);
      messagesGrouped = [];
      messagesGrouped.push(messages[i]);
      messageDay = toFormatDate(messages[i].createdAt);
    }
  }

  messagesGroupedByDay.push(messagesGrouped);

  return messagesGroupedByDay;
};
