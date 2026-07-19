import { sendWebsocketRequest } from "../websocketService";


const TAG_ACTION_DATA = {
    set:    ['room_id', 'tag_name'],
    unset:  ['room_id', 'tag_name'],
    rename: ['old_name', 'new_name'],
    delete: ['name'],
    order: [
        'room_id',
        'tag_name',
        'prev_tag',
        'next_tag',
    ],
};

/**
 * Отправляет websocket запрос на изменение тегов комнаты
 *
 * @param {Object} tagActivityData
 * @param {'set'|'unset'|'rename'|'delete'|'order'} tagActivityData.action
 * @param {Object} tagActivityData.data -  Required data fields зависят от action поля
 *
 * @example
 * updateRoomTag({
 *     action: 'set',
 *     data: {
 *         room_id: 'room_1',
 *         tag_name: 'important',
 *     },
 * });
 *
 * @throws {Error}
 */
export function updateRoomTag(tagActivityData = {}) {
    try {
        const {
            action,
            data = {},
        } = tagActivityData;

        const reqFields = TAG_ACTION_DATA[action];

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
            object: 'tag',
            action,
            data: dataToSend,
        });
    }
    catch (error) {
        console.error('Failed to update room tag:', error);
    }
}

function validateFields(data, requiredFields) {
    for (const field of requiredFields) {
        if (data[field] == null) {
            throw new Error(`Missing required field: ${field}`);
        }
    }
}
