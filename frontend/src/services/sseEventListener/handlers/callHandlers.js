import { useRoomsStore } from '@/stores/roomsStore';
import { useUsersStore } from '@/stores/usersStore';


const actionHandlers = {
    'call': handleCall,
};

/**
 * Метод для обработки события звонка по типу действия,
 * предварительно нормализуя входящие данные.
 *
 * Выполняет только обновление данных и состояния
 * приложения под капотом, не изменяя UI напрямую.
 *
 * @param {{
 *     action: string,
 *     data: {id, is_archived, is_notifications}
 * }} payload - Сырые данные для обработки.
 *
 * @returns {{}} Нормализованные данные события.
 */
export function processCallEvent(payload) {
    const { action, data } = payload;

    const actionHandler =
        actionHandlers[action];

    if (!actionHandler) {
        console.warn(
            'Unknown room action:',
            payload.action
        );

        return eventedRoom;
    }

    const callData = actionHandler(data);

    return callData;
}

/**
 * @typedef {Object} callEvent
 * @property {string} call_id
 * @property {string} caller_id
 * @property {string} room_id
 */

/**
 * @param {callEvent} payloadData
 */
function handleCall(payloadData) {
    const { call_id, caller_id, room_id } = payloadData;
     
    const roomsStore = useRoomsStore();
    const usersStore = useUsersStore();
    const callingRoom = roomsStore.getRoomById(room_id);
    const callingUser = usersStore.getUserById(caller_id);

    const callData = { 
        entities: { callingRoom, callingUser },
        payload: payloadData,
    };

    console.log('Backend call in:', callData);

    return callData;
}
