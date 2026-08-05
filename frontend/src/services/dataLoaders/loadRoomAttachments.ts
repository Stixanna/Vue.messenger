import { FetchRoomAttachments } from '@/services/roomService'
import type { Attachment } from '@/types/messages'


export async function loadRoomAttachments(
  roomId: string,
  type?: string,
  offset?: number,
  limit?: number,
): Promise<Attachment[]> {
  const attachments = await FetchRoomAttachments(roomId, type, offset, limit);

  return attachments;
}
