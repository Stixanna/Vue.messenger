import { updateRoomListWithData } from "@/services/utils/updateRoomListWithData";
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
    const messageInfo = await loadMessageInfo(payload.data.id);
    
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
    const current_user = usersStore.getCurrentUser();
    const selected_room = roomsStore.getSelectedRoom();

    const isOutgoing = current_user.id === from?.id ?? false;
    const wasSheduled = is_delayed;

    // Обозначение прочитанности сообщения
    message.is_read = wasSheduled ? false : isOutgoing;

    // Обновляем список комнат не запрашивая список с сервера
    await updateRoomListWithData(message);

    // Добавляем новое вложение к вложениям выбранной комнаты
    if (attachments.length > 0) {
        attachments.forEach(attachment => {
            // Обработка вложений разных типов
            const att_type = attachment.type.split('/')[0];
            const isImage = att_type === 'image';

            const attachmentArr = isImage
                ? selected_room.attachments.img
                : selected_room.attachments.notimg;

            attachmentArr.unshift(attachment);
        });
    }

    console.log('Backend message receive:', message);
}
/**
 * @param {MessageEvent} message
 */
function handleDelayedMessageSent(message) {
    const { room_id } = message;
    const roomsStore = useRoomsStore();
    const selected_room = roomsStore.getSelectedRoom();

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

    // Обновляем список комнат не запрашивая список с сервера
    await updateRoomListWithData({...message, is_message_update: true });

    console.log('Backend message edited:', message);
}

/**
 * @param {MessageEvent} message
 */
async function handleMessageDelete(message) {
    const { id } = message;
    const roomsStore = useRoomsStore();
    const selected_room = roomsStore.getSelectedRoom();

    // Обновляем список комнат by server так как запросить информацию о сообщении невозможно
    await updateRoomListWithData();

    // Удаляем вложение из вложений выбранной комнаты
    if (selected_room?.attachments) {
        const deleted_msg_id = id;

        const deletedAttachments = [];

        const split = (arr = []) => {
            const keep = [];

            for (const item of arr) {
                if (item.message_id === deleted_msg_id) {
                    deletedAttachments.push(item);
                } else {
                    keep.push(item);
                }
            }

            return keep;
        };

        // 1. Обновляем данные
        const nextImg = split(selected_room.attachments.img);
        const nextNotImg = split(selected_room.attachments.notimg);

        // Заменяем массивы целиком (не мутируем)
        selected_room.attachments.img = nextImg;
        selected_room.attachments.notimg = nextNotImg;

        message.deleted_attachments = deletedAttachments;
    }

    console.log('Backend message deleted:', message);
}
