<script setup>
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useRoomsStore } from '@/stores/roomsStore';
import { useUsersStore } from '@/stores/usersStore';
import { useUiStackItem } from '@/composables/useUiStackItem';
import ChatHeader from '@/components/layout/ChatHeader.vue';
import MessageList from '@/components/messages/MessageList.vue';
import ChatInput from '@/components/layout/ChatInput.vue';

const roomsStore = useRoomsStore();
const usersStore = useUsersStore();

const props = defineProps({
  selectedRoom: {
    type: Object,
    required: true,
  },
});

const {
  currentUser
} = storeToRefs(usersStore);

const canWrite = computed(() => {
  const room = props.selectedRoom;

  if (!room) {
    return false;
  }

  return currentUser.value?.roomRights?.get(room.id)?.can_write ?? false;
});

const messages = computed(() => {
  const room = props.selectedRoom;

  if (!room) {
    return false;
  }

  return room.messages;
});

useUiStackItem('active-room', () => {
  roomsStore.closeSelectedRoom();
});
</script>

<template>

  <ChatHeader
    :room="selectedRoom" />

  <MessageList
    :room-id="selectedRoom.id"
    :messages="messages" />

  <ChatInput
    v-if="canWrite"
    :room="selectedRoom" />

</template>

<style scoped>

</style>
