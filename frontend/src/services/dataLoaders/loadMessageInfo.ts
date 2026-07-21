import { FetchMessageInfo } from '@/services/messageService';

import type {
  Message,
} from '@/types/messages';


export async function loadMessageInfo(
  message_id: string,
): Promise<Message> {
  const responseData = await await FetchMessageInfo(message_id);

  return responseData;
}

