import { useRoomsStore } from '@/stores/roomsStore';
import { useTagsStore } from '@/stores/tagsStore';
import { useKeywordsStore } from '@/stores/keywordsStore';
import { FetchRooms } from '@/services/roomService';
import type { 
  Room 
} from '@/types/rooms';


export async function loadRoomList()
: Promise<Room[]> {
  const roomsStore = useRoomsStore();
  const tagsStore = useTagsStore();
  const keywordsStore = useKeywordsStore();

  const currentRooms = roomsStore.rooms;

  const responseData = await FetchRooms();

  const rawRooms = Object.entries(responseData.rooms);
  const allTags = responseData.tags;
  const allKeywords = responseData.keywords;

  // Преобразуем объект в массив чатов
  const rooms = rawRooms.map(([_, chat]) => {
    const existingRoom = currentRooms.find(r => r.id === chat.id);

    return {
      ...chat,
      details: existingRoom?.details,
      attachments: existingRoom?.attachments || {
        img: [],
        notimg: []
      },
    };
  });

  roomsStore.setRooms(rooms);
  tagsStore.setTags(allTags);
  keywordsStore.setKeywords(allKeywords);

  await roomsStore.restoreActiveRoom();

  return rooms;
}
