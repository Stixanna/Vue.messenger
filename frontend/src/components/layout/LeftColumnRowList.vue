<script setup>
import {
  computed,
  ref,
} from 'vue';
import {
  useRoomsStore,
} from '@/stores/roomsStore';
import { useContextMenuStore } from '@/stores/contextMenuStore';
import {
  menuText
} from '@/constants/menuText';
import ListItem from '@/components/ListItem.vue';
import ContextMenu from '../menus/ContextMenu.vue';

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

const contextMenuStore = useContextMenuStore();
const roomsStore = useRoomsStore();

const contextMenuRoom = ref(null);
const menuOpenEvent = ref(null);
const containerElement = ref(null);

const TEXT_VALS = {
  archive_text: "Архив",
  empty_list_text: "Пустой список",
}

const menuId = 'room-context-menu';

const menuOpened = computed(() => {
  return contextMenuStore.activeMenuId === menuId;
});

const correctedRooms = computed(() => {
  const visibleRooms = roomsStore.visibleRooms;
  const archivedRooms = roomsStore.archivedRooms;

  const archive = {
    id: 'archive',
    name: TEXT_VALS.archive_text,
    tags: [],
    keywords: [],
    last_message: {
      text: archivedRooms.length > 0 
        ? archivedRooms.map(room => room.name).join(', ') 
        : TEXT_VALS.empty_list_text,
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

const menuItems = computed(() => {
  const room = contextMenuRoom.value;

  if (!room) {
    return [];
  }

  return [
    {
      id: 'mute_room',
      value: room.is_notifications
        ? menuText.roomList.muteRoom.switchOff
        : menuText.roomList.muteRoom.switchOn,
      icon: room.is_notifications
        ? 'nobell'
        : 'bell',
    },
    {
      id: 'archive_room',
      value: room.is_archived
        ? menuText.roomList.archiveRoom.toActual
        : menuText.roomList.archiveRoom.toArchive,
      icon: room.is_archived
        ? 'unarchive'
        : 'archive',
    },
    {
      id: 'leave_room',
      value: menuText.roomList.leaveRoom,
      icon: 'nouser',
    },
  ];
});

function handleRoomContextMenu({ item, event }) {
  if (item.id === 'archive') {
    return;
  }

  contextMenuStore.openMenu(menuId);
  contextMenuRoom.value = item;
  menuOpenEvent.value = event;
}

function handleMenuClose() {
  contextMenuStore.closeMenu(menuId);
  contextMenuRoom.value = null;
}

function onItemSelect(item) {
  console.log('Selected menu item:', item);
  console.log('Selected contextMenuRoom:', contextMenuRoom.value);

  handleMenuClose();
}
</script>

<template>
<div
  id="row-list"
  class="row-list"
  data-menu-position-container
  ref="containerElement">
  <div
    id="chat-list"
    class="chat-list">
    <ListItem
      v-for="room in correctedRooms"
      :key="room.id"
      :item="room"
      @click="handleRoomClick" 
      @contextmenu="handleRoomContextMenu"
      />
  </div>

  <div
    id="message-list"
    class="chat-list" />

  <ContextMenu
    name="slide-from-left"
    :menu-id="menuId"
    :opened="menuOpened"
    :items="menuItems"
    :open-event="menuOpenEvent"
    :container-element="containerElement"

    @select="onItemSelect"
    @close="handleMenuClose" 
  />

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
