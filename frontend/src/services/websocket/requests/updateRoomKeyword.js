import { sendWebsocketRequest } from "../websocketService";


const KEYWORD_ACTION_DATA = {
    set:    ['room_id', 'name'],
    unset:  ['room_id', 'name'],
    rename: ['room_id', 'old_name', 'new_name'],
    order: [
        'room_id',
        'name',
        'prev_kw',
        'next_kw',
    ],
};

/**
 * Отправляет websocket запрос на изменение keywords комнаты
 *
 * @param {Object} kwActionData
 * @param {'set'|'unset'|'rename'|'order'} kwActionData.action
 * @param {Object} kwActionData.data -  Required data fields зависят от action поля
 *
 * @example
 * updateRoomKeyword({
 *     action: 'set',
 *     data: {
 *         room_id: 'room_1',
 *         name: 'important',
 *     },
 * });
 *
 * @throws {Error}
 */
export function updateRoomKeyword(kwActionData = {}) {
    try {
        const {
            action,
            data = {},
        } = kwActionData;

        const reqFields = KEYWORD_ACTION_DATA[action];

        if (!reqFields) {
            console.warn('Unknown action:', action);
            return;
        }

        validateFields(data, reqFields);

        const dataToSend = {};

        for (const field of reqFields) {
            dataToSend[field] = data[field];
        }

        sendWebsocketRequest({
            object: 'room_kw',
            action,
            data: dataToSend,
        });
    }
    catch (error) {
        console.error('Failed to update room keyword:', error);
    }
}

function validateFields(data, requiredFields) {
    for (const field of requiredFields) {
        if (data[field] == null) {
            throw new Error(`Missing required field: ${field}`);
        }
    }
}
