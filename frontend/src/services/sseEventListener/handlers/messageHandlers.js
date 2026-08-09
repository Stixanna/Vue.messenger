import { updateRoomListWithData } from "@/utils/updateRoomListWithData";
import { useUsersStore } from '@/stores/usersStore';
import { useRoomsStore } from '@/stores/roomsStore';
import { loadMessageInfo } from "@/services/dataLoaders/loadMessageInfo";


const messageActionHandlers = {
    'message-min': handleReceivedMessage,
    'delayed-message-min': handleDelayedMessageSent,
    'message-update-min': handleMessageUpdate,
    'message-delete-min': handleMessageDelete,
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
 *     data: {id, is_delayed}
 * }} payload - Сырые данные для обработки.
 *
 * @returns {Promise<{}>} Нормализованные данные события.
 */
export async function processMessageEvent(payload) {
    let messageInfo = payload.data;

    if(payload.action !== 'message-delete-min') 
    {
        messageInfo = await loadMessageInfo(payload.data.id);
    }

    // Обозначение сообщения ивент на которое пришел (важно при 'message-delete-min')
    messageInfo.id = payload.data.id;

    // Обозначение беком сообщения которое было отложено
    messageInfo.is_delayed = payload.data.is_delayed;

    const actionHandler =
        messageActionHandlers[payload.action];

    if (!actionHandler) {
        console.warn(
            'Unknown message action:',
            payload.action
        );

        return messageInfo;
    }

    actionHandler(messageInfo);

    return messageInfo;
}

/**
 * @typedef {Object} MessageEvent
 * @property {[{}]} attachments
 * @property {string} forward_from_user_id
 * @property {{}} from
 * @property {string} id
 * @property {string} in_reply_to
 * @property {boolean} is_edited
 * @property {boolean} is_forwarded
 * @property {number} offset
 * @property {[{}]} reactions
 * @property {string} room_id
 * @property {string} text
 * @property {number} timestamp
 * @property {number} updated_at
 * @property {boolean} is_delayed
 */

/**
 * @param {MessageEvent} message
 */
async function handleReceivedMessage(message) {
    const { attachments, from, is_delayed } = message;
    const usersStore = useUsersStore();
    const roomsStore = useRoomsStore();
    const current_user = usersStore.currentUser;
    const selected_room = roomsStore.selectedRoom;

    const isOutgoing = current_user.id === from?.id ?? false;
    const wasSheduled = is_delayed;

    // Обозначение прочитанности сообщения
    message.is_read = wasSheduled ? false : isOutgoing;

    const typedMessage = {...message, type: 'message_receive' };

    // Обновляем список комнат не запрашивая список с сервера
    await updateRoomListWithData(typedMessage);

    // вот тут должна быть проверка что комната совпадает к которой добавлять вложения
    if(message.room_id !== selected_room.id)
      return;

    roomsStore.updateRoomMessages(message.room_id, message, typedMessage.type);

    console.log('Backend message receive:', message);
}
/**
 * @param {MessageEvent} message
 */
function handleDelayedMessageSent(message) {
    const { room_id } = message;
    const roomsStore = useRoomsStore();
    const selected_room = roomsStore.selectedRoom;

    // Изменяем счетчик отложенных сообщений      
    const roomWithSheduledMessage = roomsStore.getRoomById(room_id);
    if (roomWithSheduledMessage) {
        roomWithSheduledMessage.delayed_messages = roomWithSheduledMessage.delayed_messages + 1;
        if(selected_room.id === roomWithSheduledMessage.id){
            selected_room.delayed_messages = roomWithSheduledMessage.delayed_messages;
        }
    }   

    console.log('Backend sheduled message sent:', message);
}

/**
 * @param {MessageEvent} message
 */
async function handleMessageUpdate(message) {
    const roomsStore = useRoomsStore();

    const typedMessage = {...message, type: 'message_update' };

    // Обновляем список комнат не запрашивая список с сервера
    await updateRoomListWithData(typedMessage);

    roomsStore.updateRoomMessages(message.room_id, message, typedMessage.type);

    console.log('Backend message edited:', message);
}

/**
 * @param {MessageEvent} message
 */
async function handleMessageDelete(message) {
    const { id } = message;
    const roomsStore = useRoomsStore();
    const selected_room = roomsStore.selectedRoom;

    // Обновляем список комнат by server так как запросить информацию о сообщении невозможно
    await updateRoomListWithData();

    console.log('Backend message deleted:', message);
}
