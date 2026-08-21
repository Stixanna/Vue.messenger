import { useRoomsStore } from '@/stores/roomsStore';
import { useUsersStore } from '@/stores/usersStore';

import type { Room } from '@/types/rooms';
import type { User } from '@/types/users';

interface CallEvent {
  call_id: string;
  caller_id: string;
  room_id: string;
}

interface CallEventPayload {
  action: 'call';
  data: CallEvent;
}

interface CallData {
  entities: {
    callingRoom: Room | undefined;
    callingUser: User | undefined;
  };
  payload: CallEvent;
}

type ActionHandler = (
  payloadData: CallEvent,
) => CallData;

const actionHandlers: Record<
  CallEventPayload['action'],
  ActionHandler
> = {
  call: handleCall,
};

/**
 * Обрабатывает событие звонка по типу действия,
 * предварительно нормализуя входящие данные.
 *
 * Выполняет только обновление данных и состояния
 * приложения под капотом, не изменяя UI напрямую.
 */
export function processCallEvent(
  payload: CallEventPayload,
): CallData | undefined {
  const { action, data } = payload;

  const actionHandler = actionHandlers[action];

  if (!actionHandler) {
    console.warn(
      'Unknown room action:',
      payload.action,
    );

    return undefined;
  }

  const callData = actionHandler(data);

  return callData;
}

/**
 * Обрабатывает данные входящего звонка.
 */
function handleCall(
  payloadData: CallEvent,
): CallData {
  const {
    call_id,
    caller_id,
    room_id,
  } = payloadData;

  const roomsStore = useRoomsStore();
  const usersStore = useUsersStore();

  const callingRoom =
    roomsStore.getRoomById(room_id);

  const callingUser =
    usersStore.getUserById(caller_id);

  const callData: CallData = {
    entities: {
      callingRoom,
      callingUser,
    },
    payload: payloadData,
  };

  console.log('Backend call in:', callData);

  return callData;
}