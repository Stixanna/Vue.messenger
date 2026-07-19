import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useRoomsStore } from '@/stores/roomsStore';
import type {
  Keyword,
  GlobalKeyword,
} from '@/types/keyword';


export const useKeywordsStore = defineStore(
  'keywords',
  () => {
    const keywords =
      ref<GlobalKeyword[]>([]);

    function setKeywords(
      value: GlobalKeyword[],
    ): void {
      keywords.value = value;
    }

    function addRoomKeyword(
      roomId: string,
      data: Keyword,
    ): void {
      const roomsStore =
        useRoomsStore();

      const room =
        roomsStore.getRoomById(roomId);

      if (!room) {
        return;
      }

      roomsStore.updateRoomKeywords(
        roomId,
        [...room.keywords, data],
      );

      const existingKeyword =
        keywords.value.find(
          item => item.name === data.name,
        );

      if (!existingKeyword) {
        keywords.value.push({
          name: data.name,
          count: 1,
        });

        return;
      }

      existingKeyword.count += 1;
    }

    function removeRoomKeyword(
      roomId: string,
      data: {
        name: string;
      },
    ): void {
      const roomsStore =
        useRoomsStore();

      const room =
        roomsStore.getRoomById(roomId);

      if (!room) {
        return;
      }

      roomsStore.updateRoomKeywords(
        roomId,
        room.keywords.filter(
          item => item.name !== data.name,
        ),
      );

      const keyword =
        keywords.value.find(
          item => item.name === data.name,
        );

      if (!keyword) {
        return;
      }

      keyword.count -= 1;

      if (keyword.count <= 0) {
        keywords.value =
          keywords.value.filter(
            item =>
              item.name !== data.name,
          );
      }
    }

    function updateRoomKeywordName(
      roomId: string,
      data: {
        old_name: string;
        new_name: string;
      },
    ): void {
      const roomsStore =
        useRoomsStore();

      const room =
        roomsStore.getRoomById(roomId);

      if (!room) {
        return;
      }

      const updatedKeywords =
        room.keywords.map(keyword =>
          keyword.name === data.old_name
            ? {
                ...keyword,
                name: data.new_name,
              }
            : keyword,
        );

      roomsStore.updateRoomKeywords(
        roomId,
        updatedKeywords,
      );

      updateKeywordName(data);
    }

    function updateKeywordName(data: {
      old_name: string;
      new_name: string;
    }): void {
      const keyword =
        keywords.value.find(
          item =>
            item.name === data.old_name,
        );

      if (!keyword) {
        return;
      }

      keyword.name = data.new_name;
    }

    return {
      keywords,

      setKeywords,

      addRoomKeyword,
      removeRoomKeyword,
      updateRoomKeywordName,
    };
  },
);