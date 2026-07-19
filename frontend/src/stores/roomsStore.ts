import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import {
  useUsersStore,
  parsePayloadRoomRights,
} from '@/stores/usersStore';
import type {
  Tag,
  Keyword,
  Room,
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

  /**
   * Actions
   */
  function setRooms(value: Room[]): void {
    rooms.value = value;
  }

  function getSelectedRoom(): Room | undefined {
    return rooms.value.find(room => room.selected);
  }

  function markSelectedRoom(roomId: string): void {
    rooms.value = rooms.value.map(room => ({
        ...room,
        selected: room.id === roomId,
    }));
  }

  function getRoomById(roomId: string): Room | undefined {
    return rooms.value.find(room => room.id === roomId);
  }

  function updateRoomDetails(
    roomId: string,
    details: Room['details'],
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

    getSelectedRoom,
    markSelectedRoom,
    setRooms,
    getRoomById,
    updateRoomDetails,
    updateRoomTags,
    updateRoomKeywords,
    clear,
  };
});