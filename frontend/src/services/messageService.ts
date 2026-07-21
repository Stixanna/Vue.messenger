// src/services/authService.js

import {
	apiRequest
} from '@/services/api';

import type {
  Message,
} from '@/types/messages';

export async function FetchMessageInfo(
	  message_id: string,
	): Promise<Message> {
	return apiRequest(`/message/get_by_id/?message_id=${message_id}`, { method: 'GET' });
}
