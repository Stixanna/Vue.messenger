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

export async function FetchRoomMessages(
	  room_id: string,
	  limit?: number,
	  offset?: number,
	): Promise<Message[]> {
	const querry_offset_path = offset ? `&offset=${offset}` : '';
    const querry_limit_path = limit ? `&limit=${limit}` : '';

	return apiRequest(`/message/get/?room_id=${room_id}${querry_limit_path}${querry_offset_path}`, { method: 'GET' });
}

export async function FetchRoomDelayedMessages(
	  room_id: string,
	): Promise<Message[]> {
	return apiRequest(`/message/get_delayed/?room_id=${room_id}`, { method: 'GET' });
}

export async function ToggleReaction(
	message_id: string,
	reaction: string,
): Promise<any> {
	return apiRequest(
		`/message/toggle_react/`, 
		{ 
			method: 'POST',
			body: JSON.stringify({
				"message_id": message_id,
				"reaction": reaction,
			})
		 }
	);
}

export async function FetchFile(
	file_id: string,
	is_download: boolean,
	is_thumbnail: boolean,
	thumbnail_size: boolean,
): Promise<any> {
    const download_path = is_download ? `&download=${is_download}` : '';
    const thumbnail_path = is_thumbnail ? `&thumbnail=${is_thumbnail}` : '';
    const thumbnail_size_path = thumbnail_size ? `&thumbnail_size=${thumbnail_size}` : '';
	return apiRequest(
		`/message/get_file_by_id/?file_id=${file_id}${download_path}${thumbnail_path}${thumbnail_size_path}`, 
		{ 
			method: 'GET',
		}
	);
}