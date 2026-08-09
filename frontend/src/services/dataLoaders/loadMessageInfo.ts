import { FetchMessageInfo } from '@/services/messageService';

import type {
	RequestedMessage,
} from '@/types/messages';


export async function loadMessageInfo(
  message_id: string,
): Promise<RequestedMessage> {
  const responseData = await FetchMessageInfo(message_id);

  return responseData;
}

