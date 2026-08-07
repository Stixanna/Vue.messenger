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
  GlobalTag,
} from '@/types/tag';

import type {
  GlobalKeyword,
} from '@/types/keyword';


export async function FetchRooms()
  : Promise<{rooms: Room[], tags: GlobalTag[], keywords: GlobalKeyword[]}> {
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

export async function FetchRoomAttachments(
  roomId: string,
  type?: string,
  offset = 0,
  limit = 10,
) {
  const query = new URLSearchParams({
    room_id: String(roomId),
    offset: String(offset),
    limit: String(limit),
  });

  if (type) {
    query.set('type', type);
  }

  return apiRequest(`/room/attachments/?${query.toString()}`, {
    method: 'GET',
  });
}
