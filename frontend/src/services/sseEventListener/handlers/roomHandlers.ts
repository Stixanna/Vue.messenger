import { updateRoomListWithData } from '@/utils/updateRoomListWithData';
import { useRoomsStore } from '@/stores/roomsStore';
import { loadRoomDetails } from '@/services/dataLoaders/loadRoomDetails';

import type { 
    Room,
 } from '@/types/rooms';

type RoomAction =
  | 'room-create'
  | 'roomupdate-min'
  | 'room-delete'
  | 'roomupdate_notifications'
  | 'roomupdate_archived';

interface RoomEventData {
  id: string;
  is_archived?: boolean;
  is_notifications?: boolean;
}

interface RoomEventPayload {
  action: RoomAction;
  data: RoomEventData;
}

type RoomActionHandler = (
  eventedRoom: Room,
  payloadData?: RoomEventData,
) => Promise<void> | void;

const actionHandlers: Record<RoomAction, RoomActionHandler> = {
  'room-create': handleRoomCreate,
  'roomupdate-min': handleRoomUpdate,
  'room-delete': handleRoomDelete,
  'roomupdate_notifications': handleRoomUpdateNotifications,
  'roomupdate_archived': handleRoomUpdateArchived,
};

/**
 * Обрабатывает событие комнаты по типу действия,
 * предварительно нормализуя входящие данные.
 *
 * Выполняет только обновление данных и состояния
 * приложения под капотом, не изменяя UI напрямую.
 */
export async function processRoomEvent(
  payload: RoomEventPayload,
): Promise<Room | undefined> {
  const { action, data } = payload;

  // Получаем актуальную информацию об изменившейся комнате от сервера
  const serverUpdateReqActions: RoomAction[] = [
    'room-create',
    'roomupdate-min',
  ];

  if (serverUpdateReqActions.includes(action)) {
    await updateRoomListWithData();
  }

  const roomsStore = useRoomsStore();

  const eventedRoom = roomsStore.getRoomById(data.id);

  const actionHandler = actionHandlers[action];

  if (!actionHandler) {
    console.warn(
      'Unknown room action:',
      action,
    );

    return eventedRoom;
  }

  if (eventedRoom) {
    await actionHandler(eventedRoom, data);
  }

  return eventedRoom;
}

/**
 * Обрабатывает обновление комнаты.
 */
async function handleRoomUpdate(
  eventedRoom: Room,
): Promise<void> {
  const roomsStore = useRoomsStore();

  // Обновляем детали комнаты
  const details = await loadRoomDetails(eventedRoom.id);

  roomsStore.updateRoomDetails(
    eventedRoom.id,
    details,
  );

  updateRoomListWithData({
    ...eventedRoom,
    type: 'room_details',
  });

  console.log(
    'Backend room updated:',
    eventedRoom,
  );
}

/**
 * Обрабатывает удаление комнаты.
 */
function handleRoomDelete(
  eventedRoom: Room,
): void {
  updateRoomListWithData({
    ...eventedRoom,
    type: 'room_delete',
  });

  console.log(
    'Backend room deleted:',
    eventedRoom,
  );
}

/**
 * Обрабатывает изменение статуса уведомлений комнаты.
 */
function handleRoomUpdateNotifications(
  eventedRoom: Room,
  payloadData?: RoomEventData,
): void {
  const isNotifications =
    payloadData?.is_notifications ?? eventedRoom.is_notifications;

  const updatedRoom = {
    ...eventedRoom,
    is_notifications: isNotifications,
  };

  updateRoomListWithData({
    ...updatedRoom,
    type: 'room_details',
  });

  console.log(
    'Backend room notifications status changed:',
    updatedRoom,
  );
}

/**
 * Обрабатывает изменение статуса архивирования комнаты.
 */
function handleRoomUpdateArchived(
  eventedRoom: Room,
  payloadData?: RoomEventData,
): void {
  const isArchived = payloadData?.is_archived ?? eventedRoom.is_archived;

  const updatedRoom = {
    ...eventedRoom,
    is_archived: isArchived,
  };

  updateRoomListWithData({
    ...updatedRoom,
    type: 'room_details',
  });

  console.log(
    'Backend room archive status changed:',
    updatedRoom,
  );
}

/**
 * Обрабатывает создание комнаты.
 */
function handleRoomCreate(
  eventedRoom: Room,
): void {
  // No event action here

  console.log(
    'Backend room created:',
    eventedRoom,
  );
}