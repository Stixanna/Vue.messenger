import { useUsersStore } from '@/stores/usersStore';
import { useRoomsStore } from '@/stores/roomsStore';
import { useMessagesStateStore } from '@/stores/messagesStateStore';
import {
  FetchRoomMessages,
  FetchRoomDelayedMessages
} from '@/services/messageService';
import type {
  Message,
} from '@/types/messages';

// import { getRoomById } from '../../vars/stores/roomsStore';
// import { getCurrentUser } from '../../vars/stores/currentUserStore';
// import { getReadState, getUnreadState, setReadOffset, setUnreadOffset } from '../../vars/stores/chatLoadingStateStore';


/**
 * Метод фетча и после преобразования сообщений в удобоваримый вид
 */
export async function loadRoomMessages(
  room_id: string,
  direction = 'initial',
  offset?: string,
): Promise<Message[]> {

  const messagesStateStore = useMessagesStateStore();
  const usersStore = useUsersStore();
  const roomsStore = useRoomsStore();

  const current_user = usersStore.currentUser;
  const room = roomsStore.getRoomById(room_id);
  const unread_count = Number(offset ?? room?.unread_count ?? 0);

  const initial_read = 40;
  const initial_unread = 1;
  const read_step = 5;
  const unread_step = 5;

  let fetch_offset = 0;
  let fetch_limit = 0;

  if (direction === 'initial') {
    const unreadToLoad = Math.min(unread_count, initial_unread);
    const readToLoad = initial_read;

    if (!offset) {
      fetch_offset = Math.max(
        0,
        unread_count - unreadToLoad,
      );

      fetch_limit = unreadToLoad + readToLoad;
    } else {
      const centerOffset = Math.max(
        0,
        unread_count - unreadToLoad,
      );

      const range = 20;

      const startOffset = Math.max(
        0,
        centerOffset - range,
      );

      const endOffset = centerOffset + range;

      fetch_offset = startOffset;
      fetch_limit = endOffset - startOffset;
    }

    messagesStateStore.setOffset(
      'unread',
      fetch_offset,
    );

    messagesStateStore.setOffset(
      'read',
      fetch_offset + fetch_limit,
    );

  } else if (direction === 'up') {

    const readOffset = messagesStateStore.state.read.offset;

    fetch_offset = readOffset;
    fetch_limit = read_step;

    messagesStateStore.setOffset(
      'read',
      readOffset + fetch_limit,
    );

  } else if (direction === 'down') {

    const unreadOffset = messagesStateStore.state.unread.offset;

    if (unreadOffset <= 0) {
      return [];
    }

    fetch_limit = Math.min(
      unread_step,
      unreadOffset,
    );

    fetch_offset = unreadOffset - fetch_limit;

    messagesStateStore.setOffset(
      'unread',
      fetch_offset,
    );

  } else if (direction === 'chatend') {

    fetch_limit = Math.max(
      initial_read,
      30,
    );

    fetch_offset = 0;

    messagesStateStore.setOffset(
      'read',
      fetch_limit,
    );

    messagesStateStore.setOffset(
      'unread',
      0,
    );

  } else if (direction === 'sheduled') {

  }

  console.log(`Loading messages: offset=${fetch_offset}, limit=${fetch_limit}`);   // debug

  let response;
  if (direction !== 'sheduled') {
    response = await FetchRoomMessages(room_id, fetch_limit, fetch_offset);
  }
  else {
    response = await FetchRoomDelayedMessages(room_id);
  }

  const responseData = response;

  const messages = Object.entries(responseData).map(([_, message]) => ({
    ...message,
    updated_at: message.updated_at ?? null, // если undefined — станет null
    from: message.from ?? (
      direction === 'sheduled'
        ? current_user ?? null
        : null
    ),
    is_outgoing: direction === 'sheduled' || (current_user?.id === message.from?.id),   // обозначение сообщений current_user
    replied_message: message.in_reply_to
      // ищем в responseData так как массив messages еще не сформирован
      ? responseData.find(item => item.id === message.in_reply_to) : null,
    // avatar_color: current_user.id !== message.from?.id 
    //     ? message.from 
    //         ? getTextColor(message.from.username) 
    //         : null 
    //     : null,
  }));

  // 🎯 Определение is_read для каждого сообщения
  const totalLoaded = messages.length;
  // const unreadCount = room?.unread_count || 0;
  const unreadCount = unread_count;

  if (direction === 'initial') {
    // Если загружаем с начала (initial), то:
    // - первые `unreadToLoad` — непрочитаны
    const unreadToLoad = Math.min(unreadCount, initial_unread);
    messages.forEach((msg, index) => {
      msg.is_read = index >= unreadToLoad;
    });
  } else if (direction === 'up' || direction === 'down') {
    messages.forEach((msg, index) => {
      // Считаем позицию относительно конца списка
      const msgOffset = unreadCount - (totalLoaded - index);
      msg.is_read = msgOffset < 0; // если позиция меньше нуля — это непрочитанное
    });
  } else if (direction === 'chatend') {
    messages.forEach(msg => {
      // Не обозначать прочитанность последнего для обозначения прочтенности обсервером
      if (msg.id !== room?.last_message.id)
        msg.is_read = true;
    });
  } else if (direction === 'sheduled') {
    // Для scheduled — все прочитаны
    messages.forEach(msg => {
      msg.is_read = true;
    });
  }
  // if(isInitialLoad && messages.length < fetch_offset)
  //     setReadOffset(fetch_offset);

  // Помечаем последнее сообщение как непрочитанное, чтобы обыграть наше initial_unread = 1; (hardcode)
  if (direction === 'initial' && !offset) {
    if (messages.length > 0 && messages[0]) {
      messages[0].is_read = unread_count === 0;
    }
  }

  return messages;

}
