import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useRoomsStore } from '@/stores/roomsStore';
import type {
  GlobalTag,
  AddTagPayload,
  Tag,
} from '@/types/tag';


export const useTagsStore = defineStore('tags', () => {
  const tags = ref<GlobalTag[]>([]);

  function setTags(value: GlobalTag[]): void {
    tags.value = value;
  }

  function addRoomTag(
    roomId: string,
    data: AddTagPayload,
  ): void {
    const roomsStore = useRoomsStore();

    const room = roomsStore.getRoomById(roomId);

    if (!room) {
      return;
    }

    const roomTag: Tag = {
      tag_id: data.tag_id,
      name: data.tag_name,
      order: data.order_num,
    //   is_shared: data.is_shared,
    //   user_id: data.user_id,
    };

    roomsStore.updateRoomTags(
      roomId,
      [...room.tags, roomTag],
    );

    const existingTag = tags.value.find(
      tag => tag.name === data.tag_name,
    );

    if (!existingTag) {
      tags.value.push({
        id: data.tag_id,
        name: data.tag_name,
        count: 1,
      });

      return;
    }

    existingTag.count += 1;
  }

  function removeRoomTag(
    roomId: string,
    data: {
      tag_id: string;
      tag_name: string;
    },
  ): void {
    const roomsStore = useRoomsStore();

    const room = roomsStore.getRoomById(roomId);

    if (!room) {
      return;
    }

    roomsStore.updateRoomTags(
      roomId,
      room.tags.filter(
        tag => tag.tag_id !== data.tag_id,
      ),
    );

    const tag = tags.value.find(
      item => item.name === data.tag_name,
    );

    if (!tag) {
      return;
    }

    tag.count -= 1;

    if (tag.count <= 0) {
      tags.value = tags.value.filter(
        item => item.id !== data.tag_id,
      );
    }
  }

  function updateTagName(data: {
    old_name: string;
    new_name: string;
  }): void {
    const tag = tags.value.find(
      item => item.name === data.old_name,
    );

    if (!tag) {
      return;
    }

    tag.name = data.new_name;
  }

  return {
    tags,

    setTags,
    addRoomTag,
    removeRoomTag,
    updateTagName,
  };
});