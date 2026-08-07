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

    case 'message_update':
      rooms = updateRoomListWithMessage(data, false);
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
	message: MessageUpdate,
  insertToTop = true
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

  const isMessageUpdate =
    message.id === room.last_message?.id || message.type === 'message_update';

  const shouldUpdate = isMessageUpdate || insertToTop;

  const updId = shouldUpdate ? message.id : room.last_message?.id;
  const updFromId = shouldUpdate ? message.from?.id : room.last_message?.from;
  const updIsAttachments = shouldUpdate
    ? message.attachments.length > 0
    : room.last_message?.is_attachments;
  const updUsername = shouldUpdate
    ? message.from?.username
    : room.last_message?.username;
  const updText = shouldUpdate
    ? message.text
    : room.last_message?.text;
  const updTimestamp = shouldUpdate
    ? message.timestamp
    : room.last_message?.timestamp;

  room.unread_count =
    !isOutgoing || wasSheduled
      ? isMessageUpdate
        ? room.unread_count
        : room.unread_count + 1
      : 0;

  room.is_archived =
    room.is_archived && room.is_notifications
      ? false
      : room.is_archived;

  room.last_message.timestamp = updTimestamp;

  Object.assign(room.last_message, {
    id: updId,
    from: updFromId,
    is_attachments: updIsAttachments,
    username: updUsername,
    text: updText,
    timestamp: updTimestamp,
  });

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
