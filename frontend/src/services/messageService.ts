// src/services/authService.js

import {
	apiRequest
} from '@/services/api';

import type {
  Message,
	RequestedMessage,
} from '@/types/messages';

export async function FetchMessageInfo(
	  message_id: string,
	): Promise<RequestedMessage> {
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
			body: {
				message_id: message_id,
				reaction: reaction,
			}
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

export async function SendMessage(
	room_id: string,
	text: string,
	embedMessageObject?: {
		id: string; 
		embed_type: string
	} | null,
	timestamp?: string,
): Promise<null> {
	const messageData: any = {
        room_id: room_id,
        text: text,
    };

    if (embedMessageObject){
        const embed_message_id = embedMessageObject.id;
        const is_embed_reply = embedMessageObject.embed_type === 'reply';
        if(is_embed_reply)
            messageData.in_reply_to = embed_message_id;
    }
    if(timestamp)
        messageData.timestamp = timestamp;

	return apiRequest(
		`/message/send/`, 
		{ 
			method: 'POST',
			body: messageData
		 }
	);
}

export async function EditMessage(
	message_id: string,
	text: string,
): Promise<null> {
	const messageData: any = {
        message_id: message_id,
        text: text,
    };
	return apiRequest(
		`/message/edit/`, 
		{ 
			method: 'PATCH',
			body: messageData
		 }
	);
}

export async function ForwardMessage(
	from_room_id: string,
	to_room_id: string,
	message_ids: string[],
): Promise<null> {
	const messageData: any = {
        from_room_id: from_room_id,
        to_room_id: to_room_id,
        forwarded_message_ids: message_ids,
    };
	return apiRequest(
		`/message/forward/`, 
		{ 
			method: 'POST',
			body: messageData
		 }
	);
}

export async function SendAttachmentMessage(
	formData: any,
): Promise<null> {
	return apiRequest(
		`/message/send_files/`,
		{
			method: 'POST',
			body: formData,
		}
	);
}
