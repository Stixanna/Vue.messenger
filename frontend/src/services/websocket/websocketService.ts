// import * as cbor from 'cbor-web';
import cbor from 'cbor-web';

import { BASE_URL } from '@/config';
import {
  startConnectionErrorNotify,
  stopConnectionErrorNotify,
} from '@/globalUIMethods/connectionErrorNotify';

import { routeServerEvent } from './handlers/serverHandlers';
import { routeTagEvent } from './handlers/tagHandlers';
import { routeKwEvent } from './handlers/keywordHandlers';
import type { EventPayload } from '@/types/events';

const CONNECTION_STATE = {
  CONNECTED: 'connected',
  MANUAL_RETRYING: 'manual-retrying',
} as const;

type ConnectionState =
  typeof CONNECTION_STATE[keyof typeof CONNECTION_STATE];

interface WebSocketRequest extends EventPayload {
  object: string;
  action: string;
  data: Record<string, unknown>;
}

interface WebSocketData {
  object: string;
  action: string;
  data: Record<string, unknown>;
  status?: string;
  correlation_id?: string;
  error?: unknown;
  timestamp?: string;
}

type WebSocketEventHandler = (
  data: WebSocketData,
) => unknown;

const wsEventHandlers: Record<string, WebSocketEventHandler> = {
  server: routeServerEvent,
  tag: routeTagEvent,
  room_kw: routeKwEvent,
};

let connectionState: ConnectionState = CONNECTION_STATE.CONNECTED;

let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let reconnectDelay = 1000;

const MAX_RECONNECT_DELAY = 8000;

let WSConnection: WebSocket | null = null;

/**
 * Запускает слушатель WebSocket-событий.
 *
 * @param isInitial - Является ли подключение первоначальным.
 */
export function initWebSocket(isInitial = false): void {
  setupWebsocket(isInitial);
}

/**
 * Проверяет, установлено ли WebSocket-соединение.
 */
export function isWebsocketConnected(): boolean {
  return connectionState === CONNECTION_STATE.CONNECTED;
}

/**
 * Отправляет запрос через WebSocket.
 */
export function sendWebsocketRequest({
  object,
  action,
  data = {},
}: WebSocketRequest): void {
  const websocket = getWebsocket();

  const encodedData = cbor.encode({
    object,
    action,
    data,
    correlation_id: crypto.randomUUID(),
  });

  websocket.send(encodedData);
}

/**
 * Возвращает активное WebSocket-соединение.
 *
 * @throws Если WebSocket не подключён.
 */
function getWebsocket(): WebSocket {
  if (!isWebsocketConnected() || !WSConnection) {
    throw new Error('❌ WebSocket не подключен!');
  }

  return WSConnection;
}

/**
 * Закрывает текущее WebSocket-соединение.
 */
function cleanupWebsocket(): void {
  if (WSConnection) {
    WSConnection.close();
    WSConnection = null;
  }
}

/**
 * Планирует переподключение WebSocket.
 */
function scheduleReconnect(): void {
  cleanupWebsocket();

  if (reconnectTimer) {
    return;
  }

  console.warn(
    `🔁 WebSocket переподключение через ${reconnectDelay / 1000} сек`,
  );

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;

    setupWebsocket();

    reconnectDelay = Math.min(
      reconnectDelay * 2,
      MAX_RECONNECT_DELAY,
    );
  }, reconnectDelay);
}

/**
 * Формирует URL WebSocket-соединения.
 */
function getWebSocketUrl(path = '/stream/ws'): string {
  const isDev = (
    BASE_URL.startsWith('https:')
    || BASE_URL.startsWith('http:')
  );

  if (isDev) {
    const wsProtocol = BASE_URL.startsWith('https:')
      ? 'wss'
      : 'ws';

    const wsBaseUrl = BASE_URL.replace(
      /^https?/,
      wsProtocol,
    );

    return `${wsBaseUrl}${path}`;
  }

  const { protocol, host } = window.location;

  const wsProtocol = protocol === 'https:'
    ? 'wss:'
    : 'ws:';

  return `${wsProtocol}//${host}${BASE_URL}${path}`;
}

/**
 * Создаёт WebSocket-соединение.
 *
 * @param isInitial - Является ли подключение первоначальным.
 */
function setupWebsocket(isInitial = false): void {
  cleanupWebsocket();

  const websocket = new WebSocket(getWebSocketUrl());

  WSConnection = websocket;

  websocket.onopen = () => {
    console.log('✅ WebSocket соединение установлено');

    reconnectDelay = 1000;
    connectionState = CONNECTION_STATE.CONNECTED;

    stopConnectionErrorNotify('websocket');

    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }

    if (!isInitial) {
      // TODO: сделать рефреш данных после переподключения.
    }
  };

  websocket.onmessage = (event: MessageEvent) => {
    void handleWebsocketData(event.data);
  };

  websocket.onclose = () => {
    console.warn('⚠️ WebSocket соединение закрыто');

    connectionState = CONNECTION_STATE.MANUAL_RETRYING;

    startConnectionErrorNotify('websocket');

    scheduleReconnect();
  };

  websocket.onerror = (error: Event) => {
    console.warn('⚠️ WebSocket ошибка', error);

    // Реконнект выполняется в onclose,
    // чтобы избежать двойного переподключения.
  };
}

/**
 * Декодирует сырые данные, полученные от WebSocket.
 */
async function parseWebsocketData(
  data: Blob | ArrayBuffer | string,
): Promise<WebSocketData> {
  console.log('📨 Пришло сообщение WebSocket:', data);

  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as WebSocketData;
    } catch {
      throw new Error('Не удалось распарсить данные как JSON');
    }
  }

  let arrayBuffer: ArrayBuffer;

  if (data instanceof Blob) {
    arrayBuffer = await data.arrayBuffer();
  } else {
    arrayBuffer = data;
  }

  try {
    const bytes = new Uint8Array(arrayBuffer);

    return cbor.decode(bytes) as WebSocketData;
  } catch (error) {
    console.error('Ошибка декодирования WebSocket:', error);
    throw error;
  }
}

/**
 * Обрабатывает данные, полученные от WebSocket.
 */
async function handleWebsocketData(
  rawData: Blob | ArrayBuffer | string,
): Promise<void> {
  let decodedData: WebSocketData;

  try {
    decodedData = await parseWebsocketData(rawData);
  } catch (error) {
    console.error('❌ WS parse error', error);
    return;
  }

  console.log('Incoming WS Info:', decodedData);

  const {
    object,
    action,
    status,
  } = decodedData;

  if (status === 'error') {
    console.warn('⚠️ Server error:', decodedData.error);
    return;
  }

  const handler = wsEventHandlers[object];

  if (!handler) {
    console.warn(
      '⚠️ Unhandled ws event:',
      object,
      decodedData,
    );

    return;
  }

  const normalizedData = handler(decodedData);

  const eventKey = `${object}:${action}`;

  // TODO: Если потребуется event bus:
  // emit(eventKey, normalizedData);

  void normalizedData;
  void eventKey;
}