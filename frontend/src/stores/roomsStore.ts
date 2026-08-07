import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { loadRoomMessages } from '@/services/dataLoaders/loadRoomMessages';
import { loadRoomDetails } from "@/services/dataLoaders/loadRoomDetails";
import { loadRoomAttachments } from '@/services/dataLoaders/loadRoomAttachments';
import { useSettingsStore } from '@/stores/settingsStore';
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
import type {
  Message,
  Attachment,
} from '@/types/messages';


export const useRoomsStore = defineStore('rooms', () => {
  const usersStore = useUsersStore();
  const settingsStore = useSettingsStore();
  /**
   * State
   */
  const rooms = ref<Room[]>([]);
  
  /**
   * Getters
   */

  const visibleRooms = computed(() => {
    const result = rooms.value.filter(room => !room.is_archived);

    if (!settingsStore.isRoomsResorted) {
      return result;
    }

    return [...result].sort((a, b) =>
      new Date(a.last_message?.timestamp ?? 0).getTime() -
      new Date(b.last_message?.timestamp ?? 0).getTime()
    );
  });

  const archivedRooms = computed(() => {
    const result = rooms.value.filter(room => room.is_archived);

    if (!settingsStore.isRoomsResorted) {
      return result;
    }

    return [...result].sort((a, b) =>
      new Date(a.last_message?.timestamp ?? 0).getTime() -
      new Date(b.last_message?.timestamp ?? 0).getTime()
    );
  });

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
    const init_attachments_count = 50

    // Пока хендлеров для обновления кеша сообщений нет, всегда подгружаем их
    // if (!room.attachments) {
      room.attachments = await loadRoomAttachments(
        room.id,
        'img',
        0,
        init_attachments_count
      );
    // }

    // Пока хендлеров для обновления кеша сообщений нет, всегда подгружаем их
    // if (!room.messages) {
      room.messages = await loadRoomMessages(
        room.id,
        'initial',
      );
    // }
    mergeMessageAttachments(room.messages, room.attachments);
  }

  function mergeMessageAttachments(
    messages: Message[],
    attachments: Attachment[],
  ): void {
    const attachmentsById = new Map(
      attachments.map(attachment => [attachment.id, attachment]),
    );

    for (const message of messages) {
      if (!message.attachments?.length) {
        continue;
      }

      message.attachments = message.attachments.map(attachment => {
        const fullAttachment = attachmentsById.get(attachment.id);

        return fullAttachment
          ? {
              ...attachment,
              ...fullAttachment,
            }
          : attachment;
      });
    }
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

    visibleRooms,
    archivedRooms,
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