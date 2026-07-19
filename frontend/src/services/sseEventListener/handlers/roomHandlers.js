import { updateRoomListWithData } from "@/services/utils/updateRoomListWithData";
import { useRoomsStore } from '@/stores/roomsStore';
import { loadRoomDetails } from "@/services/dataLoaders/loadRoomDetails";


const actionHandlers = {
    'room-create': handleRoomCreate,
    'roomupdate-min': handleRoomUpdate,

    'room-delete': handleRoomDelete,
    'roomupdate_notifications': handleRoomUpdateNotifications,
    'roomupdate_archived': handleRoomUpdateArchived,
};

/**
 * Метод для обработки события сообщений по типу действия,
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
 * @returns {Promise<{}>} Нормализованные данные события.
 */
export async function processRoomEvent(payload) {
    const { action, data } = payload;

    // Получаем актуальную информацию об изменившейся комнате от сервера
    const serverUpdateReqActions = ['room-create','roomupdate-min']
    if(serverUpdateReqActions.includes(action))
        await updateRoomListWithData();
    const roomsStore = useRoomsStore();

    const eventedRoom = roomsStore.getRoomById(data.id);

    const actionHandler =
        actionHandlers[payload.action];

    if (!actionHandler) {
        console.warn(
            'Unknown room action:',
            payload.action
        );

        return eventedRoom;
    }

    await actionHandler(eventedRoom, data);

    return eventedRoom;
}

/**
 * @typedef {Object} roomEvent
 * @property {{}} attachments
 * @property {string} created_at
 * @property {string} date
 * @property {number} delayed_messages
 * @property {{}} details
 * @property {string} id
 * @property {boolean} is_archived
 * @property {boolean} is_notifications
 * @property {{}} last_message
 * @property {string} name
 * @property {boolean} selected
 * @property {[{}]} tags
 * @property {string} timestamp
 * @property {number} unread_count
 */

/**
 * @param {roomEvent} eventedRoom
 */
async function handleRoomUpdate(eventedRoom) {
    const roomsStore = useRoomsStore();
    // Обновляем детали комнаты
    const details = await loadRoomDetails(eventedRoom.id);
    roomsStore.updateRoomDetails(eventedRoom.id, details);

    updateRoomListWithData({...eventedRoom, is_room_details: true});

    console.log('Backend room updated:', eventedRoom);
}
/**
 * @param {roomEvent} eventedRoom
 */
function handleRoomDelete(eventedRoom) {

    updateRoomListWithData({...eventedRoom, is_room_delete: true});

    console.log('Backend room deleted:', eventedRoom);
}

/**
 * @param {roomEvent} eventedRoom
 * @param {{is_notifications}} payloadData
 */
function handleRoomUpdateNotifications(eventedRoom, payloadData) {
    const { is_notifications } = payloadData;

    eventedRoom = {...eventedRoom, is_notifications: is_notifications}
    updateRoomListWithData({...eventedRoom, is_room_details: true});

    console.log('Backend room notifications status changed:', eventedRoom);
}

/**
 * @param {roomEvent} eventedRoom
 * @param {{is_archived}} payloadData
 */
function handleRoomUpdateArchived(eventedRoom, payloadData) {
    const { is_archived } = payloadData;

    eventedRoom = {...eventedRoom, is_archived: is_archived}
    updateRoomListWithData({...eventedRoom, is_room_details: true});

    console.log('Backend room archive status changed:', eventedRoom);
}

/**
 * @param {roomEvent} eventedRoom
 */
function handleRoomCreate(eventedRoom) {

    // No event action here

    console.log('Backend room created:', eventedRoom);
}
