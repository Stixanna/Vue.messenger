// src/services/authService.js
import {
  apiRequest
} from '@/services/api';

import type {
  Room,
  RoomDetails,
} from '@/types/rooms';

import type {
  Invite,
} from '@/types/invites';

import type {
  Tag,
} from '@/types/tag';

import type {
  Keyword,
} from '@/types/keyword';


export async function FetchRooms()
  : Promise<{rooms: Room[], tags: Tag[], keywords: Keyword[]}> {
  return apiRequest('/room/list', { method: 'GET' });
}

export async function FetchRoomDetails(
  room_id: string,
): Promise<RoomDetails> {
  return apiRequest(`/room/detail/?room_id=${room_id}`, { method: 'GET' });
}

export async function FetchInvites()
  : Promise<Invite[]> {
  return apiRequest('/room/invites', { method: 'GET' });
}
