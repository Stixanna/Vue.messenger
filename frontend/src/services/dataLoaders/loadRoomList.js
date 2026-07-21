import { useRoomsStore } from '@/stores/roomsStore';
import { useTagsStore } from '@/stores/tagsStore';
import { useKeywordsStore } from '@/stores/keywordsStore';
import { useSettingsStore } from '@/stores/settingsStore';

import { FetchRooms } from '@/services/roomService';

import { formatRelativeTime } from '@/services/utils/formatRelativeTime';

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
      date: lastMsg
        ? formatRelativeTime(lastMsg.timestamp)
        : `Created ${formatRelativeTime(chat.created_at)}`,
      timestamp: lastMsg ? lastMsg.timestamp : -Infinity,
      last_message: lastMsg,
    };
  });
  // if(prevSelectedRoom){
  //     const room = rooms.find(item => item.id === prevSelectedRoom.id);
  //     if(room) 
  //         room.selected = true;
  // }

  // Сортировка комнат по времени последнего сообщения
  const sortingOrderReversed = settingsStore.isRoomsResorted;
  rooms.sort(sortingOrderReversed ? (b, a) : (a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  roomsStore.setRooms(rooms);
  tagsStore.setTags(allTags);
  keywordsStore.setKeywords(allKeywords);

  return rooms;
}
