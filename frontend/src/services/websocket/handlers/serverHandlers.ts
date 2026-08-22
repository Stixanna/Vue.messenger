import { normalizeDataPayload } from '@/services/websocket/normalizeDataPayload';
import type { EventPayload } from '@/types/events';

interface ServerEventPayload extends EventPayload{
  status?: string;
}

type ServerActionHandler = (
  payload: ServerEventPayload,
) => void;

const serverActionHandlers: Record<
  string,
  ServerActionHandler
> = {
  connection: handleServerConnection,
};

/**
 * Маршрутизирует серверные события по типу действия,
 * предварительно нормализуя входящие данные.
 */
export function routeServerEvent(
  payload: ServerEventPayload,
): Record<string, unknown> {
  const normalizedData =
    normalizeDataPayload(payload.data);

  const actionHandler =
    serverActionHandlers[payload.action];

  if (!actionHandler) {
    console.warn(
      'Unknown tag action:',
      payload.action,
    );

    return normalizedData;
  }

  // Пока не понятно какие хендлеры тут должны быть
  actionHandler(payload);

  return normalizedData;
}

function handleServerConnection(
  payload: ServerEventPayload,
): void {
  if (payload.status !== 'ok') {
    console.error(
      'WS connection errored: ',
      payload,
    );
  }
}