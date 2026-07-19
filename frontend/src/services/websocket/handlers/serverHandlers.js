import { normalizeDataPayload } from "@/services/websocket/normalizeDataPayload";


const serverActionHandlers = {
    connection: handleServerConnection,
};

/**
 * Метод для маршрутизации серверных событий по типу действия,
 * предварительно нормализуя входящие данные.
 *
 * Выполняет только обновление данных и состояния
 * приложения под капотом, не изменяя UI напрямую.
 *
 * @param {{
 *     action: string,
 *     data: Object
 * }} payload - Сырые данные для обработки.
 *
 * @returns {{}} Нормализованные данные события.
 */
export function routeServerEvent(payload) {
    const normalizedData =
        normalizeDataPayload(payload.data);

    const actionHandler =
        serverActionHandlers[payload.action];

    if (!actionHandler) {
        console.warn(
            'Unknown tag action:',
            payload.action
        );

        return normalizedData;
    }

    // Пока не понятно какие хендлеры тут должны быть
    actionHandler(payload);

    return normalizedData;
}

function handleServerConnection(payload) {
    if (payload.status !== 'ok')
        console.error('WS connection errored: ', payload);
}
