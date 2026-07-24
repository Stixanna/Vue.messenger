import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { loadRoomMessages } from '@/services/dataLoaders/loadRoomMessages';
import { loadRoomDetails } from "@/services/dataLoaders/loadRoomDetails";
import {
  useUsersStore,
  parsePayloadRoomRights,
} from '@/stores/usersStore';
import type {
  Tag,
  Keyword,
  Room,
  RoomDetails,
} from '@/types/rooms';


export const useRoomsStore = defineStore('rooms', () => {
  const usersStore = useUsersStore();
  /**
   * State
   */
  const rooms = ref<Room[]>([]);
  
  /**
   * Getters
   */
  const archivedRoom = computed(() =>
    rooms.value.find(room => room.is_archived),
  );

  const selectedRoom = computed(() =>
    rooms.value.find(room => room.selected),
  );

  const activeRoomId = ref<string | null>(
    localStorage.getItem('active_room'),
  );

  function setActiveRoom(roomId: string): void {
    activeRoomId.value = roomId;

    localStorage.setItem(
      'active_room',
      roomId,
    );
  }

  /**
   * Actions
   */
  function setRooms(value: Room[]): void {
    rooms.value = value;
  }

  function markSelectedRoom(roomId: string): void {
    rooms.value.forEach(room => {
      room.selected = room.id === roomId;
    });
  }

  async function selectRoom(roomId: string): Promise<void> {

    const room = getRoomById(roomId);

    if (!room || room.selected) {
      return;
    }

    markSelectedRoom(roomId);
    setActiveRoom(roomId);
    // setCachedRoomId(roomId);

    if (!room.details) {
      const details = await loadRoomDetails(room.id);

      updateRoomDetails(room.id, details);
    }

    // Пока хендлеров для обновления кеша сообщений нет, всегда подгружаем их
    // if (!room.messages) {
      room.messages = await loadRoomMessages(
        room.id,
        'initial',
      );
    // }
  }

  async function restoreActiveRoom() {
    if (!activeRoomId.value) {
      return;
    }

    const room = getRoomById(activeRoomId.value);

    if (!room) {
      activeRoomId.value = null;
      return;
    }

    await selectRoom(room.id);
  }

  function getRoomById(roomId: string): Room | undefined {
    return rooms.value.find(room => room.id === roomId);
  }

  function updateRoomDetails(
    roomId: string,
    details: RoomDetails,
  ): void {
    if (!roomId || !details) {
      console.error('No required data');
      return;
    }

    const room = getRoomById(roomId);

    if (!room) {
      return;
    }

    room.details = details;

    room.details?.users?.forEach(user => {
      const userRights =
        parsePayloadRoomRights(user);

      usersStore.updateUserRoomRights(
        String(user.id),
        roomId,
        userRights,
      );
    });
  }

  function updateRoomTags(
    roomId: string,
    tags: Tag[],
  ): void {
    const room = getRoomById(roomId);

    if (!room) {
      return;
    }

    room.tags = tags;
  }

  function updateRoomKeywords(
    roomId: string,
    keywords: Keyword[],
  ): void {
    const room = getRoomById(roomId);

    if (!room) {
      return;
    }

    room.keywords = keywords;
  }

  function clear(): void {
    rooms.value = [];
  }

  return {
    rooms,

    archivedRoom,
    activeRoomId,
    selectedRoom,

    restoreActiveRoom,
    selectRoom,
    setRooms,
    getRoomById,
    updateRoomDetails,
    updateRoomTags,
    updateRoomKeywords,
    clear,
  };
});