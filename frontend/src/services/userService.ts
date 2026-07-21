// src/services/authService.js

import {
  apiRequest
} from '@/services/api';

import type {
  User,
} from '@/types/users';

export async function FetchUsers()
  : Promise<User[]> {
  return apiRequest('/user/list', { method: 'GET' });
}

export async function FetchCurrentUser()
  : Promise<User[]> {
  return apiRequest('/user/me', { method: 'GET' });
}
