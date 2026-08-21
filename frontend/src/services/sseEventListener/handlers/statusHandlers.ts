import { useUsersStore } from '@/stores/usersStore';
import type { 
    StatusEvent,
} from '@/types/events';



interface StatusEventPayload {
  action: 'user-status';
  data: StatusEvent;
}

type ActionHandler = (
  payloadData: StatusEvent,
) => Promise<boolean>;

const actionHandlers: Record<
  StatusEventPayload['action'],
  ActionHandler
> = {
  'user-status': handleUserStatus,
};

const appliedUserStatuses = new Map<string, number>();
const userStatusTimers = new Map<string, ReturnType<typeof setTimeout>>();
const userLastStatusEvent = new Map<
  string,
  {
    user: StatusEvent;
    timestamp: number;
  }
>();

const USER_STATUS_DELAY = 1000;

/**
 * Обрабатывает событие статуса,
 * предотвращая мигание UI при обновлении страницы.
 *
 * Выполняет только обновление данных и состояния
 * приложения под капотом, не изменяя UI напрямую.
 */
export async function processStatusEvent(
  payload: StatusEventPayload,
): Promise<boolean> {
  const { action, data } = payload;

  const actionHandler = actionHandlers[action];

  if (!actionHandler) {
    console.warn(
      'Unknown status action:',
      action,
    );

    return false;
  }

  return actionHandler(data);
}

/**
 * Обрабатывает изменение статуса пользователя.
 */
function handleUserStatus(
  payloadData: StatusEvent,
): Promise<boolean> {
  const updatingUser = payloadData;
  const userId = updatingUser.id;

  const incomingTs = new Date(
    updatingUser.status.timestamp,
  ).getTime();

  // Сохраняем последнее входящее событие.
  userLastStatusEvent.set(userId, {
    user: updatingUser,
    timestamp: incomingTs,
  });

  // Таймер уже существует — просто обновили последнее событие.
  if (userStatusTimers.has(userId)) {
    return Promise.resolve(false);
  }

  return new Promise<boolean>((resolve) => {
    const timerId = setTimeout(() => {
      const lastEvent = userLastStatusEvent.get(userId);

      userStatusTimers.delete(userId);

      if (!lastEvent) {
        resolve(false);
        return;
      }

      const appliedTimestamp =
        appliedUserStatuses.get(userId);

      // Уже применяли это состояние.
      if (
        appliedTimestamp !== undefined
        && appliedTimestamp >= lastEvent.timestamp
      ) {
        resolve(false);
        return;
      }

      const usersStore = useUsersStore();

      const statusedUser =
        usersStore.getUserById(userId);

      const currentStatus =
        statusedUser?.status?.is_online;

      const nextStatus =
        lastEvent.user.status?.is_online;

      // Состояние фактически не изменилось.
      if (currentStatus === nextStatus) {
        appliedUserStatuses.set(
          userId,
          lastEvent.timestamp,
        );

        resolve(false);
        return;
      }

      usersStore.updateUser(lastEvent.user);

      appliedUserStatuses.set(
        userId,
        lastEvent.timestamp,
      );

      resolve(true);
    }, USER_STATUS_DELAY);

    userStatusTimers.set(userId, timerId);
  });
}