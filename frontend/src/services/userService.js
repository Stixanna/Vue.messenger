// src/services/authService.js

import {
	apiRequest
} from '@/services/api';

export async function FetchUsers() {
	return apiRequest('/user/list', { method: 'GET' });
}

export async function FetchCurrentUser() {
	return apiRequest('/user/me', { method: 'GET' });
}
