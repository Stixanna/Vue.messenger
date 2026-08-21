import { useInvitesStore } from '@/stores/invitesStore';
import { useRoomsStore } from '@/stores/roomsStore';

interface InviteEvent {
  from: string;
  room_id: string;
}

interface InviteEventPayload {
  action: 'invite';
  data: InviteEvent;
}

type ActionHandler = (
  payloadData: InviteEvent,
) => void;

const actionHandlers: Record<
  InviteEventPayload['action'],
  ActionHandler
> = {
  invite: handleInvite,
};

/**
 * Обрабатывает событие приглашения.
 *
 * Выполняет только обновление данных и состояния
 * приложения под капотом, не изменяя UI напрямую.
 */
export function processInviteEvent(
  payload: InviteEventPayload,
): void {
  const { action, data } = payload;

  const actionHandler = actionHandlers[action];

  if (!actionHandler) {
    console.warn(
      'Unknown action:',
      payload.action,
    );

    return;
  }

  actionHandler(data);
}

/**
 * Обрабатывает данные пришедшего приглашения.
 */
function handleInvite(
  payloadData: InviteEvent,
): void {
  const invitesStore = useInvitesStore();
  const room = useRoomsStore().getRoomById(payloadData.room_id);
  const invite = {
    id: 'temp_invite_id',   // hardcoded temporary ID, should be replaced with a real one from the server
    name: room?.name || 'Unknown Room',
  }

  invitesStore.addInvite(invite);
}