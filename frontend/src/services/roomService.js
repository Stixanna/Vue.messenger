// src/services/authService.js

import {
	apiRequest
} from '@/services/api';

export async function FetchRooms() {
	return apiRequest('/room/list', { method: 'GET' });
}

export async function FetchRoomDetails(room_id) {
	return apiRequest(`room/detail/?room_id=${room_id}`, { method: 'GET' });
}

export async function FetchInvites() {
	return apiRequest('/room/invites', { method: 'GET' });
}
