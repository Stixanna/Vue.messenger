import { BASE_URL } from '@/config';
import { routeServerEvent } from './handlers/serverHandlers';
import { routeTagEvent } from './handlers/tagHandlers';
import { routeKwEvent } from './handlers/keywordHandlers';

import { startConnectionErrorNotify, stopConnectionErrorNotify } from '@/globalUIMethods/connectionErrorNotify';
import cbor from 'cbor-web';
// import { emit } from '../uiEvents/uiEventBus';



const CONNECTION_STATE = {
    CONNECTED: 'connected',
    MANUAL_RETRYING: 'manual-retrying',
};
let connectionState = CONNECTION_STATE.CONNECTED;

let reconnectTimer = null;
let reconnectDelay = 1000; 
const MAX_RECONNECT_DELAY = 8000;

let WSConnection = null;

const wsEventHandlers = {
    'server': routeServerEvent,
    'tag': routeTagEvent,
    'room_kw':  routeKwEvent,
};

/**
 * Метод запускающий слушатель Websocket событий
 * @param {boolean} is_initial Если объявлен, то не вызывать refreshAllData() 
 */
export function initWebSocket(is_initial) {
    setupWebsocket(is_initial);
}

/**
 * Метод проверяющий подключено ли Websocket
 */
export function isWebsocketConnected() {
    return connectionState === 'connected';
}

/**
 * Отправка websocket запроса
 * @param {Object} payload
 * @param {string} payload.object
 * @param {string} payload.action
 * @param {Object} payload.data
 */
export function sendWebsocketRequest({
    object,
    action,
    data = {},
}) {
    try {
        const WSConnection = getWebsocket();

        console.log('Outgoing WS Data: ', data);
        const encodedData = cbor.encode({
            object,
            action,
            data,
            correlation_id: crypto.randomUUID(),
        });

        WSConnection.send(encodedData);
    }
    catch (error) {
        console.error('Websocket send error:', error);
        throw error;
    }
}

/**
 * Метод получения вебсокет соединения
 */
function getWebsocket() {
    if(!isWebsocketConnected())
        throw new Error('❌ Websocket не подключен!', e);

    return WSConnection;
}

/**
 * Очистка Websocket
 */
function cleanupWebsocket() {
    if (WSConnection) {
        WSConnection.close();
        WSConnection = null;
    }
}

/**
 * Планирование реконнекта
 */
function scheduleReconnect() {
    cleanupWebsocket();

    if (reconnectTimer) return; // защита от дублирования

    console.warn(`🔁 WebSocket переподключение через ${reconnectDelay / 1000} сек`);

    reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        setupWebsocket();
        reconnectDelay = Math.min(reconnectDelay * 2, MAX_RECONNECT_DELAY);
    }, reconnectDelay);
}

function getWebSocketUrl(path = '/stream/ws') {
    // hardcode dev mode
    const is_dev = BASE_URL.startsWith('https:') || BASE_URL.startsWith('http:');
    if(is_dev){  
        let wsBaseUrl = BASE_URL.replace('https', BASE_URL.startsWith('https') ? 'wss' : 'ws');
        const wsUrl = `${wsBaseUrl}${path}`;
        return wsUrl
    }

    const { protocol, host } = window.location;

    const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:';

    return `${wsProtocol}//${host}${BASE_URL}${path}`;
}

/**
 * Создание Websocket соединения
 * @param {boolean} is_initial Если объявлен, то не вызывать refreshAllData() 
 */
function setupWebsocket(is_initial) {
    cleanupWebsocket();

    WSConnection = new WebSocket(getWebSocketUrl());

    WSConnection.onopen = async () => {
        console.log('✅ WebSocket соединение установлено');

        reconnectDelay = 1000;
        connectionState = CONNECTION_STATE.CONNECTED;

        stopConnectionErrorNotify('websocket');

        if (reconnectTimer) {
            clearTimeout(reconnectTimer);
            reconnectTimer = null;
        }

        if (!is_initial) {
            // делать рефреш данных приходящих по ws
        }
    };

    WSConnection.onmessage = (event) => {
        handleWebsocketData(event.data);
    };

    WSConnection.onclose = () => {
        console.warn('⚠️ WebSocket соединение закрыто');

        connectionState = CONNECTION_STATE.MANUAL_RETRYING;
        startConnectionErrorNotify('websocket');

        scheduleReconnect();
    };

    WSConnection.onerror = (error) => {
        console.warn('⚠️ WebSocket ошибка', error);

        // Важно: не реконнектимся тут напрямую
        // onclose всё равно вызовется → избегаем двойного вызова
    };
}

/**
 * Метод для получения объекта из сырых данных от сервера
 * @param {cbor | string} data - Сырые данные для обработки 
 */
async function parceWebsocketData(data) {
    console.log('📨 Пришло сообщение Websocket:', data);  // debug
    let decodedData = {};
    let arrayBuffer;
    
    if (data instanceof Blob) {
        // Blob → ArrayBuffer
        arrayBuffer = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(data);
        });
    } else if (data instanceof ArrayBuffer) {
        arrayBuffer = Promise.resolve(data);
    } else if (typeof data === 'string') {
        // Если это строка (текст), пробуем декодировать как JSON
        try {
            decodedData = JSON.parse(data);
        } catch (e) {
            throw new Error('Не удалось распарсить как JSON');
        }
    } else {
        throw new Error('Неизвестный тип данных: ' + typeof data);
    }

    // Ждем ArrayBuffer и декодируем cbor
    try {
        const bytes = new Uint8Array(arrayBuffer);
        decodedData = cbor.decode(bytes);

    } catch (err) {
        console.error('incoming', `Ошибка декодирования: ${err.message}`);
        throw err;
    }

    return decodedData;
}

/**
 * Метод для обработки пришедших от сервера данных
 * @param {cbor | string} dryData - Сырые данные для обработки 
 */
async function handleWebsocketData(dryData) {
    let decodedData;

    try {
        decodedData = await parceWebsocketData(dryData);
    } catch (error) {
        console.error('❌ WS parse error', error);
        return;
    }

    console.log('Incoming WS Info: ', decodedData);

    const {
        object,
        action,
        data,
        status,
        correlation_id,
        error,
        timestamp,
    } = decodedData;

    if (status === 'error') {
        console.warn('⚠️ Server error:', decodedData.error);
        return;
    }

    const handler = wsEventHandlers[object];

    if (!handler) {
        console.warn('⚠️ Unhandled ws event:', handler, decodedData);
        return;
    }

    // Обработка логики и получение нормализованой json data
    const normalizedData = handler(decodedData);

    // Обработка логики и получение нормализованой json data
    const eventKey = `${object}:${action}`;

    // скорее всего не нужно будет, все изменения сами сделаются vue
    // emit(eventKey, normalizedData);
}
