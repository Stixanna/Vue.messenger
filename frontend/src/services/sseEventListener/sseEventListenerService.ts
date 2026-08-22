import { BASE_URL } from '@/config';

import { loadCurrentInfo } from '@/services/dataLoaders/loadCurrentInfo';
import { notifyIfRequired } from '@/globalUIMethods/notifyIfRequired';
import {
  startConnectionErrorNotify,
  stopConnectionErrorNotify,
} from '@/globalUIMethods/connectionErrorNotify';
// import { emit } from '@/services/uiEventBus';

import { processMessageEvent } from './handlers/messageHandlers';
import { processRoomEvent } from './handlers/roomHandlers';
import { processCallEvent } from './handlers/callHandlers';
import { processStatusEvent } from './handlers/statusHandlers';
import { processInviteEvent } from './handlers/inviteHandlers';
import type { DrySSEEvent } from '@/types/events';

const CONNECTION_STATE = {
  CONNECTED: 'connected',
  NATIVE_RETRYING: 'native-retrying',
  MANUAL_RETRYING: 'manual-retrying',
} as const;

type ConnectionState =
  typeof CONNECTION_STATE[keyof typeof CONNECTION_STATE];

type SSEEventType =
  | 'message-min'
  | 'delayed-message-min'
  | 'message-update-min'
  | 'message-delete-min'
  | 'invite'
  | 'room-create'
  | 'roomupdate-min'
  | 'room-delete'
  | 'roomupdate_notifications'
  | 'roomupdate_archived'
  | 'call'
  | 'room-tag-set'
  | 'room-tag-unset'
  | 'tag-update'
  | 'user-status'
  | 'reaction-set'
  | 'reaction-unset'
  | 'reaction-changed';

interface SSEEvent extends DrySSEEvent{
  type: SSEEventType;
  data: any;
}

let connectionState: ConnectionState = CONNECTION_STATE.CONNECTED;

let reconnectDelay = 1000;

const MAX_RECONNECT_DELAY = 8000;
const EVENTSOURCE_GRACE_TIMEOUT = 10000;

let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let eventSourceSSE: EventSource | null = null;

/**
 * Запускает слушатель SSE-событий.
 *
 * @param isInitial - Является ли подключение первоначальным.
 */
export function sseEventListener(isInitial = false): void {
  setupSSE(isInitial);
}

/**
 * Проверяет, установлено ли SSE-соединение.
 */
export function isSseConnected(): boolean {
  return connectionState === CONNECTION_STATE.CONNECTED;
}

/**
 * Закрывает текущее SSE-соединение.
 */
function cleanupSSE(): void {
  if (eventSourceSSE) {
    eventSourceSSE.close();
    eventSourceSSE = null;
  }
}

/**
 * Планирует ручное переподключение SSE.
 */
function scheduleReconnect(): void {
  cleanupSSE();

  console.warn(
    `🔁 Ручное SSE переподключение через ${reconnectDelay / 1000} сек`,
  );

  setTimeout(() => {
    setupSSE();

    reconnectDelay = Math.min(
      reconnectDelay * 2,
      MAX_RECONNECT_DELAY,
    );
  }, reconnectDelay);
}

/**
 * Создаёт SSE-соединение.
 *
 * @param isInitial - Является ли подключение первоначальным.
 */
function setupSSE(isInitial = false): void {
  cleanupSSE();

  const eventSource = new EventSource(
    `${BASE_URL}/stream/sse`,
    {
      withCredentials: true,
    },
  );

  eventSourceSSE = eventSource;

  eventSource.onopen = async () => {
    console.log('✅ SSE соединение установлено');

    reconnectDelay = 1000;
    connectionState = CONNECTION_STATE.CONNECTED;

    stopConnectionErrorNotify('sse');

    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }

    if (!isInitial) {
      await refreshAllData();
    }
  };

  eventSource.onmessage = (event: MessageEvent<string>) => {
    void handleSSEMessage(event.data);
  };

  eventSource.onerror = (error: Event) => {
    console.warn('⚠️ SSE соединение потеряно', error);

    if (connectionState === CONNECTION_STATE.CONNECTED) {
      connectionState = CONNECTION_STATE.NATIVE_RETRYING;

      startConnectionErrorNotify('sse');

      reconnectTimer = setTimeout(() => {
        if (
          connectionState === CONNECTION_STATE.NATIVE_RETRYING
        ) {
          connectionState = CONNECTION_STATE.MANUAL_RETRYING;
          scheduleReconnect();
        }
      }, EVENTSOURCE_GRACE_TIMEOUT);

      return;
    }

    if (connectionState === CONNECTION_STATE.MANUAL_RETRYING) {
      scheduleReconnect();
    }
  };
}

/**
 * Загружает актуальные данные после восстановления SSE-соединения.
 */
async function refreshAllData(): Promise<void> {
  await loadCurrentInfo();
}

/**
 * Парсит входящее SSE-сообщение.
 */
function parseSSEData(
  rawData: string,
): SSEEvent {
  return JSON.parse(rawData) as SSEEvent;
}

/**
 * Обрабатывает входящее SSE-сообщение.
 */
async function handleSSEMessage(
  rawData: string,
): Promise<void> {
  let data: SSEEvent;

  try {
    data = parseSSEData(rawData);
  } catch (error) {
    console.error('❌ Ошибка парсинга SSE данных', error);
    return;
  }

  await handleSSEData(data);
}

/**
 * Обрабатывает событие, полученное через SSE.
 */
async function handleSSEData(
  data: SSEEvent,
): Promise<void> {
  console.log('📨 Пришло сообщение SSE:', data);

  const normalizedPayload = {
    action: data.type,
    data: data.data,
  } 

  const notificatedEvents: SSEEventType[] = [
    'message-min',
    'invite',
    'call',
  ];

  if (notificatedEvents.includes(data.type)) {
    if (data.type !== 'message-min') {
      notifyIfRequired(normalizedPayload);
    }
  }

  switch (data.type) {
    case 'message-min':
    case 'delayed-message-min':
    case 'message-update-min':
    case 'message-delete-min': {
      const message = await processMessageEvent({
        action: data.type,
        data: data.data,
      });

    //   emit(data.type, message);
      break;
    }

    case 'invite': {
      processInviteEvent({
        action: data.type,
        data: data.data,
      });

    //   emit(data.type, data.data);
      break;
    }

    case 'room-create':
    case 'roomupdate-min':
    case 'room-delete':
    case 'roomupdate_notifications':
    case 'roomupdate_archived': {
      const updatedRoom = await processRoomEvent({
        action: data.type,
        data: data.data,
      });

    //   emit(data.type, updatedRoom);
      break;
    }

    case 'call': {
      const callData = processCallEvent({
        action: data.type,
        data: data.data,
      });

    //   emit(data.type, callData);
      break;
    }

    case 'room-tag-set':
    case 'room-tag-unset':
    case 'tag-update': {
    //   emit(data.type, data);
      break;
    }

    case 'user-status': {
      const isChanged = await processStatusEvent({
        action: data.type,
        data: data.data,
      });

      if (isChanged) {
        // emit(data.type, data.data);
      }

      break;
    }

    case 'reaction-set':
    case 'reaction-unset':
    case 'reaction-changed': {
    //   emit(data.type, data);
      break;
    }

    default:
      console.log('📨 Raw data.type:', data.type);
  }
}