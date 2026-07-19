import { isMobileDevice } from '@/globalUIMethods/isMobileDevice';
import { showPopup } from '@/globalUIMethods/showPopup';
// import { columnLeft, Main } from '../vars/globalElements';
// import { getCurrentLanguage } from '../vars/stores/currentLanguageStore';


// Хранилище таймеров по типу соединения
const reconnectNotificationTimers = {};

// Сообщения по типу соединения
const CONNECTION_MESSAGES = {
    websocket: '⚠️ Потеряно соединение с сервером (WebSocket)\nПереподключение...',
    sse: '⚠️ Поток обновлений прерван (SSE)\nПереподключение...',
    default: '⚠️ Соединение потеряно\nПереподключение...',
};

/**
 * Получение текста уведомления по типу соединения
 * @param {'sse' | 'websocket'} connection_type - Тип подключения, если не передан - default
 */
function getConnectionMessage(connection_type) {
    return CONNECTION_MESSAGES[connection_type] || CONNECTION_MESSAGES.default;
}

/**
 * Уведомление пользователя о проблемах с подключением
 * @param {'sse' | 'websocket'} connection_type - Тип подключения, если не передан - default
 */
export function startConnectionErrorNotify(connection_type) {
    if (reconnectNotificationTimers[connection_type]) return;

    // const container = !isMobileDevice() ? columnLeft : Main;
    const container = document.body;
    const message = getConnectionMessage(connection_type);

    const notify = () => {
        showPopup(container, message);

        reconnectNotificationTimers[connection_type] = setTimeout(
            notify,
            2500
        );
    };

    notify();
}

/**
 * Остановка уведомлений
 * @param {'sse' | 'websocket'} connection_type - Тип подключения, если не передан - default
 */
export function stopConnectionErrorNotify(connection_type) {
    const timer = reconnectNotificationTimers[connection_type];

    if (timer) {
        clearTimeout(timer);
        delete reconnectNotificationTimers[connection_type];
    }
}