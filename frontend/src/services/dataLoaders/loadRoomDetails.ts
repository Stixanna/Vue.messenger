import { FetchRoomDetails } from '@/services/roomService';


import type {
  RoomDetails,
} from '@/types/rooms';


export async function loadRoomDetails(
  room_id: string,
): Promise<RoomDetails> {
  let room_details;

  const responseData = await FetchRoomDetails(room_id);

  room_details = responseData;

  return room_details;
}

