import { FetchMessageInfo } from '@/services/messageService';


/**
 * Метод фетча информации о сообщении
 * @param {String} message_id Id сообщения.
 * @returns {Promise<{ id, room_id, text, offset, updated_at, timestamp, in_reply_to, is_edited, is_forwarded, forwarded_from_user_id, reactions:[{}], attachments:[{}], from:{} } | undefined>} message Объект информации сообщения 
 */
export async function loadMessageInfo( message_id ) {
    try {
        const responseData = await await FetchMessageInfo(message_id);

        return responseData;
    } 
    catch (error) {
        // Ошибки сети или JSON-парсинга
        console.error('Error loading message information:', error);
    }
}

