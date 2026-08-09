import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { loadRoomMessages } from '@/services/dataLoaders/loadRoomMessages';
import { loadRoomDetails } from "@/services/dataLoaders/loadRoomDetails";
import { loadRoomAttachments } from '@/services/dataLoaders/loadRoomAttachments';
import { isImageByMimeType } from '@/utils/isImageByMimeType';
import { useSettingsStore } from '@/stores/settingsStore';
import {
  useUsersStore,
  parsePayloadRoomRights,
} from '@/stores/usersStore';
import type {
  Room,
  RoomDetails,
  RoomAttachments,
} from '@/types/rooms';
import type {
  Message,
  Attachment,
} from '@/types/messages';
import type {
  RoomTag,
} from '@/types/tag';
import type {
  RoomKeyword,
} from '@/types/keyword';


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

    return [...result].sort((a, b) => {
      const timestampA = new Date(
        a.last_message?.timestamp ?? 0,
      ).getTime();

      const timestampB = new Date(
        b.last_message?.timestamp ?? 0,
      ).getTime();

      return settingsStore.isRoomsResorted
        ? timestampA - timestampB
        : timestampB - timestampA;
    });
  });

  const archivedRooms = computed(() => {
    const result = rooms.value.filter(room => room.is_archived);

    return [...result].sort((a, b) => {
      const timestampA = new Date(
        a.last_message?.timestamp ?? 0,
      ).getTime();

      const timestampB = new Date(
        b.last_message?.timestamp ?? 0,
      ).getTime();

      return settingsStore.isRoomsResorted
        ? timestampA - timestampB
        : timestampB - timestampA;
    });
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
      const attachments: RoomAttachments = {
        img: [],
        notimg: [],
      };
      // Пока загружаем только изображения
      attachments.img = await loadRoomAttachments(
        room.id,
        'img',
        0,
        init_attachments_count
      );
      room.attachments = attachments;
    // }

    // Пока хендлеров для обновления кеша сообщений нет, всегда подгружаем их
    // if (!room.messages) {
      room.messages = await loadRoomMessages(
        room.id,
        'initial',
      );
    // }
    mergeMessageAttachments(room.messages, room.attachments.img);
  }

  function updateRoomMessages(
    roomId: string,
    message: Message,
    type: 'message_receive' | 'message_update' | 'message_delete',
  ): void {
    const room = getRoomById(roomId);

    if(!room) {
      console.warn(`Room ${roomId} not found while updating message`, message);
      return;
    }

    if(!room.messages) {
      return;
    }

    if(type === 'message_receive') {
      room.messages.unshift(message);

      if (message.attachments.length > 0) {
        message.attachments.forEach(attachment => {
          const isImage = isImageByMimeType(attachment);

          const attachmentArr = isImage
            ? room.attachments?.img
            : room.attachments?.notimg;

          attachmentArr?.unshift(attachment);
        });
      }
    }
    else if(type === 'message_update') {
      const roomMessage = room.messages.find(m => m.id === message.id);

      if(!roomMessage) {
        console.warn(`Message ${message.id} not found in room ${roomId} while updating message`, message);
        return;
      }

      Object.assign(roomMessage, message);
    }
    else if(type === 'message_delete') {
      room.messages = room.messages.filter(m => m.id !== message.id);

      // // Удаляем вложение из вложений выбранной комнаты
      // if (room.attachments) {
      //   const deleted_msg_id = message.id;

      //   const deletedAttachments = [];

      //   const split = (arr = []) => {
      //     const keep = [];

      //     for (const item of arr) {
      //       if (item.message_id === deleted_msg_id) {
      //         deletedAttachments.push(item);
      //       } else {
      //         keep.push(item);
      //       }
      //     }

      //     return keep;
      //   };

      //   // 1. Обновляем данные
      //   const nextImg = split(room.attachments.img);
      //   const nextNotImg = split(room.attachments.notimg);

      //   // Заменяем массивы целиком (не мутируем)
      //   room.attachments.img = nextImg;
      //   room.attachments.notimg = nextNotImg;

      //   // message.deleted_attachments = deletedAttachments;
      // }
    }
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
    tags: RoomTag[],
  ): void {
    const room = getRoomById(roomId);

    if (!room) {
      return;
    }

    room.tags = tags;
  }

  function updateRoomKeywords(
    roomId: string,
    keywords: RoomKeyword[],
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

    updateRoomMessages,
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