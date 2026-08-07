import { useRoomsStore } from '@/stores/roomsStore';
import { useTagsStore } from '@/stores/tagsStore';
import { useKeywordsStore } from '@/stores/keywordsStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { FetchRooms } from '@/services/roomService';
import { formatRelativeTime } from '@/utils/formatRelativeTime';

// import { getSelectedRoom } from '../../vars/stores/selectedRoomStore';


/**
 * Метод фетча и после преобразования списка комн в удобоваримый вид
 */
export async function loadRoomList() {
  const roomsStore = useRoomsStore();
  const tagsStore = useTagsStore();
  const keywordsStore = useKeywordsStore();
  const settingsStore = useSettingsStore();

  let rawRooms, allTags, allKeywords = [];

  const currentRooms = roomsStore.rooms;
  // const prevSelectedRoom = getSelectedRoom();

  const responseData = await FetchRooms();

  rawRooms = Object.entries(responseData.rooms);
  allTags = responseData.tags;
  allKeywords = responseData.keywords;


  // Преобразуем объект в массив чатов
  const rooms = rawRooms.map(([_, chat]) => {
    const lastMsg = chat.last_message;

    const existingRoom = currentRooms.find(r => r.id === chat.id);

    return {
      ...chat,
      details: existingRoom?.details ?? null,
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
