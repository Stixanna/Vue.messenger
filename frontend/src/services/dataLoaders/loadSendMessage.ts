import { useRoomsStore } from '@/stores/roomsStore';
import { useDraftMessageStore } from '@/stores/draftMessageStore';

import { SendMessage } from "@/services/messageService";
import { SendAttachmentMessage } from '@/services/messageService';
interface EmbedMessage {
  id: string;
  embed_type: 'reply' | 'forward' | 'edit';
}

type SendMessageResponse = null | undefined;

/**
 * Отправляет сообщение в текущую комнату.
 *
 * Для сообщения с вложениями используется multipart/form-data,
 * для обычного сообщения — JSON-запрос SendMessage.
 */
export async function loadSendMessage(
  messageText: string,
  embedMessageObject: EmbedMessage = {} as EmbedMessage,
  timestamp?: string,
) : Promise<SendMessageResponse> {
  const roomsStore = useRoomsStore();
  const selectedRoom = roomsStore.selectedRoom;
  const draftStore = useDraftMessageStore();
  const attachments = draftStore.attachments;

  if (!selectedRoom || (!messageText && !attachments?.length)) {
    console.error('No data required to send messageText');
    return;
  }

  if (!attachments?.length) {
    return SendMessage(
      selectedRoom.id,
      messageText,
      embedMessageObject,
      timestamp,
    );
  }

  const formData = new FormData();

  attachments.forEach(file => {
    formData.append('files', file);
  });

  formData.append('room_id', selectedRoom.id);
  formData.append('text', messageText);

  if (timestamp) {
    formData.append('timestamp', timestamp);
  }

  if (embedMessageObject.embed_type === 'reply') {
    formData.append('in_reply_to', embedMessageObject.id);
  }

  return SendAttachmentMessage(formData);
}