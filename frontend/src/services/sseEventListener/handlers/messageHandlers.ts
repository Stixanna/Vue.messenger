import { updateRoomListWithData } from '@/utils/updateRoomListWithData';
import { useUsersStore } from '@/stores/usersStore';
import { useRoomsStore } from '@/stores/roomsStore';
import { loadMessageInfo } from '@/services/dataLoaders/loadMessageInfo';
import type { RequestedMessage } from '@/types/messages';
import type { EventPayload } from '@/types/events';

type MessageAction =
  | 'message-min'
  | 'delayed-message-min'
  | 'message-update-min'
  | 'message-delete-min';

type MessageEventType =
  | 'message_receive'
  | 'message_update'
  | 'message_delete'

interface MessageEventPayload extends EventPayload {
  data: {
    id: string;
    is_delayed?: boolean;
  };
}

interface MessageEvent extends RequestedMessage {
  is_delayed?: boolean;
}

interface TypedMessage extends MessageEvent {
  type: MessageEventType;
}

type MessageActionHandler = (
  message: MessageEvent,
) => void | Promise<void>;

const messageActionHandlers: Partial<
  Record<MessageAction, MessageActionHandler>
> = {
  'message-min': handleReceivedMessage,
  'delayed-message-min': handleDelayedMessageSent,
  'message-update-min': handleMessageUpdate,
  'message-delete-min': handleMessageDelete,
};

/**
 * Обрабатывает событие сообщения в зависимости от типа действия.
 *
 * Нормализует входящие данные, загружает дополнительную информацию
 * о сообщении и передает его соответствующему обработчику.
 */
export async function processMessageEvent(
  payload: MessageEventPayload,
): Promise<MessageEvent> {
  let messageInfo: MessageEvent;

  if (payload.action !== 'message-delete-min') {
    messageInfo = await loadMessageInfo(payload.data.id);
  } else {
    messageInfo = payload.data as MessageEvent;
  }

  // ID сообщения, на которое пришло событие.
  messageInfo.id = payload.data.id;

  // Признак отложенного сообщения, переданный backend.
  messageInfo.is_delayed = payload.data.is_delayed;

  const actionHandler =
    messageActionHandlers[payload.action as MessageAction];

  if (!actionHandler) {
    console.warn('Unknown message action:', payload.action);

    return messageInfo;
  }

  await actionHandler(messageInfo);

  return messageInfo;
}

async function handleReceivedMessage(
  message: MessageEvent,
): Promise<void> {
  const { from, is_delayed: isDelayed } = message;

  const usersStore = useUsersStore();
  const roomsStore = useRoomsStore();

  const currentUser = usersStore.currentUser;
  const selectedRoom = roomsStore.selectedRoom;

  const isOutgoing = currentUser?.id === from?.id;
  const wasScheduled = isDelayed === true;

  // Сообщение считается прочитанным сразу только для исходящих сообщений.
  message.is_read = wasScheduled ? false : isOutgoing;

  const typedMessage: TypedMessage = {
    ...message,
    type: 'message_receive',
  };

  // Обновляем список комнат без повторного запроса списка с сервера.
  await updateRoomListWithData(typedMessage);

  // Если комната сообщения не открыта, сообщение уже обработано
  // через обновление списка комнат.
  if (!selectedRoom || message.room_id !== selectedRoom.id) {
    return;
  }

  roomsStore.updateRoomMessages(
    message.room_id,
    message,
    typedMessage.type,
  );

  console.log('Backend message receive:', message);
}

function handleDelayedMessageSent(
  message: MessageEvent,
): void {
  const { room_id: roomId } = message;

  const roomsStore = useRoomsStore();
  const selectedRoom = roomsStore.selectedRoom;

  const room = roomsStore.getRoomById(roomId);

  if (!room) {
    return;
  }

  room.delayed_messages += 1;

  if (selectedRoom?.id === room.id) {
    selectedRoom.delayed_messages = room.delayed_messages;
  }

  console.log('Backend scheduled message sent:', message);
}

async function handleMessageUpdate(
  message: MessageEvent,
): Promise<void> {
  const roomsStore = useRoomsStore();

  const typedMessage: TypedMessage = {
    ...message,
    type: 'message_update',
  };

  // Обновляем список комнат без повторного запроса списка с сервера.
  await updateRoomListWithData(typedMessage);

  roomsStore.updateRoomMessages(
    message.room_id,
    message,
    typedMessage.type,
  );

  console.log('Backend message edited:', message);
}

/**
 * Для удаленного сообщения невозможно получить актуальную информацию
 * через loadMessageInfo, поэтому список комнат обновляется с сервера.
 *
 * @param message - Данные удаленного сообщения.
 */
async function handleMessageDelete(
  message: MessageEvent,
): Promise<void> {
  const typedMessage: TypedMessage = {
    ...message,
    type: 'message_delete',
  };

  // Обновляем список комнат с сервера,
  // так как информацию об удаленном сообщении получить невозможно.
  await updateRoomListWithData(typedMessage);

  console.log('Backend message deleted:', message);
}