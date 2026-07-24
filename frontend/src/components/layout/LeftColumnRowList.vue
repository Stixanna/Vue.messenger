<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoomsStore } from '@/stores/roomsStore';
import ListItem from '@/components/ListItem.vue';

const props = defineProps({
  treeView: {
    type: Boolean,
    default: false,
  },

  showSharedTags: {
    type: Boolean,
    default: false,
  },

  roomResort: {
    type: Boolean,
    default: false,
  },
});

const roomsStore = useRoomsStore();

const {
  rooms
} = storeToRefs(roomsStore);

const TEXT_VALS = {
  archive_text: "Архив",
  empty_list_text: "Пустой список",
}

const correctedRooms = computed(() => {
  const archivedRooms = rooms.value
    .filter(room => room.is_archived)
    .sort((a, b) => {
      if (!props.roomResort) {
        return 0;
      }

      return (
        new Date(a.last_message?.timestamp ?? 0) -
        new Date(b.last_message?.timestamp ?? 0)
      );
    });

  const visibleRooms = rooms.value
    .filter(room => !room.is_archived)
    .sort((a, b) => {
      if (!props.roomResort) {
        return 0;
      }

      return (
        new Date(a.last_message?.timestamp ?? 0) -
        new Date(b.last_message?.timestamp ?? 0)
      );
    });

  const archive = {
    id: 'archive',
    name: TEXT_VALS.archive_text,
    tags: [],
    keywords: [],
    last_message: {
      text: archivedRooms.length > 0 ?
        archivedRooms.map(room => room.name).join(', ') :
        TEXT_VALS.empty_list_text,
    },
    unread_count: 0,
  };

  return [
    archive,
    ...visibleRooms,
  ];
});

async function handleRoomClick(room) {
  if (room.id === 'archive') {
    openSidebar('archived_chats');
    return;
  }

  if (room.selected) {
    return;
  }

  await roomsStore.selectRoom(room.id);
}
</script>

<template>
<div
  id="row-list"
  class="row-list"
  data-menu-position-container>
  <div
    id="chat-list"
    class="chat-list">
    <ListItem
      v-for="room in correctedRooms"
      :key="room.id"
      :item="room"
      @click="handleRoomClick" />
  </div>

  <div
    id="message-list"
    class="chat-list" />
</div>
</template>

<style scoped>
.row-list {
  --avatar-size: 3.375rem;
  height: 100%;
  overflow-y: auto;
  position: relative;
}

#chat-list.chat-list {
  padding-bottom: .5rem;
}

.chat-list {
  --padding-inline: .5rem;
  padding: 0 var(--padding-inline);
}
</style>
