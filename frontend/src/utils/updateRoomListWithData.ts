import { loadRoomList } from '@/services/dataLoaders/loadRoomList'
import { useUsersStore } from '@/stores/usersStore'
import { useRoomsStore } from '@/stores/roomsStore'
import type { 
  RequestedMessage,
} from '@/types/messages';
import type { 
  Room,
  RoomDetails,
} from '@/types/rooms';
import type { Tag } from '@/types/tag';

type MessageUpdate = RequestedMessage & {
  type: 'message_update';
};

type MessageReceive = RequestedMessage & {
  type: 'message_receive';
};

type TagUpdate = Tag & {
  type: 'tag_rename';
  old_name: string, 
  new_name: string
};

type DetailsUpdate = Room & {
  type: 'room_details';
};

type DeleteRoomUpdate = {
  type: 'room_delete';
  id: string;
};

type RoomUpdateData =
  | MessageReceive
  | MessageUpdate
  | TagUpdate
  | DetailsUpdate
  | DeleteRoomUpdate;

/**
 * Метод для изменения списка комнат не запрашивая новый список от сервера
 */
export async function updateRoomListWithData(
  data?: RoomUpdateData,
): Promise<void> {
  const roomsStore = useRoomsStore();

  let rooms: Room[];

  if (!data) {
    rooms = await loadRoomList();

    roomsStore.setRooms(rooms);
    return;
  }


  switch (data.type) {
    case 'room_details':
      rooms = updateRoomListWithNewDetails(data);
      break;

    case 'room_delete':
      rooms = updateRoomListWithDeletedRoomId(data);
      break;

    case 'message_receive':
    case 'message_update':
      rooms = updateRoomListWithMessage(data);
      break;

    case 'tag_rename':
      rooms = updateRoomListWithTag(data);
      break;

    default:
      return;
  }

  roomsStore.setRooms(rooms);
}

export function updateRoomListWithMessage(
	message: MessageUpdate | MessageReceive,
): Room[] {
  const roomsStore = useRoomsStore()
  const usersStore = useUsersStore()
  const rooms = roomsStore.rooms
  const current_user = usersStore.currentUser

  const roomId = message.room_id
  const isOutgoing = current_user.id === message.from?.id
  const wasSheduled = isOutgoing && !message.is_read

  const room = roomsStore.getRoomById(roomId);
  if(!room){
    console.warn(`Room ${roomId} not found while updating message`, message);
    return rooms;
  }

  // определяем необходимость изменения последнего сообщения
  const isNewLastMessage = message.type === 'message_receive';
  const isMessageEdit = message.type === 'message_update';

  const isLastMessage =
      message.id === room.last_message.id;

  const isLastMessageEdited =
      isMessageEdit && isLastMessage;


  const shouldUpdateLastMessage =
      isLastMessageEdited || isNewLastMessage;
  
  const lastMessageData = shouldUpdateLastMessage
    ? {
      id: message.id,
      from: message.from?.id,
      is_attachments: message.attachments.length > 0,
      username: message.from?.username,
      text: message.text,
      timestamp: message.timestamp,
    }
    : room.last_message;

  const updatedRoom = {
    ...room,

    unread_count:
      !isOutgoing || wasSheduled
        ? isMessageEdit
          ? room.unread_count
          : room.unread_count + 1
        : 0,

    timestamp: shouldUpdateLastMessage
      ? message.timestamp
      : room.last_message.timestamp,

    last_message: {
      ...room.last_message,
      ...lastMessageData,
    },
  };

  Object.assign(room, updatedRoom);

  return rooms
}

export function updateRoomListWithNewDetails(
	details: Room,
): Room[] {
  const roomsStore = useRoomsStore()
  let rooms = roomsStore.rooms

  const updatedRooms = rooms.map((room) => {
    if (room.id === details.id) {
      // точка входа в изменение комнаты в нашем списке
      return {
        ...room,
        // change if req
        name: details.name ?? room.name,
        is_archived: details.is_archived ?? room.is_archived,
        is_notifications: details.is_notifications ?? room.is_notifications,
        tags: details.tags ?? room.tags,
      }
    }
    return room
  })

  return updatedRooms
}

export function updateRoomListWithDeletedRoomId(
	data: {
    id: string
  },
): Room[] {
  const roomsStore = useRoomsStore()
  let rooms = roomsStore.rooms
  const deleted_id = data.id

  const updatedRooms = rooms.filter((room) => room.id !== deleted_id)

  return updatedRooms
}

export function updateRoomListWithTag(
	tag_data: {
    old_name: string, 
    new_name: string
  },
): Room[] {
  const roomsStore = useRoomsStore()
  let rooms = roomsStore.rooms

  const updatedRooms = rooms.map((room) => {
    // Обновляем теги комнаты
    const updatedTags = room.tags?.map((tag) => {
      if (tag.name === tag_data.old_name) {
        return {
          ...tag,
          name: tag_data.new_name, // Присваиваем новое имя
        }
      }
      return tag
    })

    // Возвращаем обновленную комнату с обновленными тегами
    return {
      ...room,
      tags: updatedTags,
    }
  })

  return updatedRooms
}
