import { showPopup } from '@/globalUIMethods/showPopup';

type ConnectionType = 'sse' | 'websocket';

const reconnectNotificationTimers: Partial<
  Record<ConnectionType, ReturnType<typeof setTimeout>>
> = {};

const CONNECTION_MESSAGES: Record<ConnectionType | 'default', string> = {
  websocket:
    '⚠️ Потеряно соединение с сервером (WebSocket)\nПереподключение...',
  sse:
    '⚠️ Поток обновлений прерван (SSE)\nПереподключение...',
  default:
    '⚠️ Соединение потеряно\nПереподключение...',
};

/**
 * Возвращает текст уведомления для типа соединения.
 *
 * @param connectionType - Тип соединения.
 */
function getConnectionMessage(
  connectionType: ConnectionType,
): string {
  return (
    CONNECTION_MESSAGES[connectionType]
    ?? CONNECTION_MESSAGES.default
  );
}

/**
 * Запускает периодические уведомления о проблемах с соединением.
 *
 * @param connectionType - Тип соединения.
 */
export function startConnectionErrorNotify(
  connectionType: ConnectionType,
): void {
  if (reconnectNotificationTimers[connectionType]) {
    return;
  }

  const container = document.body;
  const message = getConnectionMessage(connectionType);

  const notify = (): void => {
    showPopup(container, message);

    reconnectNotificationTimers[connectionType] = setTimeout(
      notify,
      2500,
    );
  };

  notify();
}

/**
 * Останавливает уведомления о проблемах с соединением.
 *
 * @param connectionType - Тип соединения.
 */
export function stopConnectionErrorNotify(
  connectionType: ConnectionType,
): void {
  const timer = reconnectNotificationTimers[connectionType];

  if (!timer) {
    return;
  }

  clearTimeout(timer);
  delete reconnectNotificationTimers[connectionType];
}