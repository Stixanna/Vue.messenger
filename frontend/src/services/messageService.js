// src/services/authService.js

import {
	apiRequest
} from '@/services/api';

export async function FetchMessageInfo(message_id) {
	return apiRequest(`message/get_by_id/?message_id=${message_id}`, { method: 'GET' });
}
