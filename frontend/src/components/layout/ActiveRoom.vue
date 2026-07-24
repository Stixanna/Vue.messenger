<script setup>
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import ChatHeader from '@/components/layout/ChatHeader.vue';
import MessageList from '@/components/messages/MessageList.vue';
import ChatInput from '@/components/layout/ChatInput.vue';
import { useRoomsStore } from '@/stores/roomsStore';
import { useUsersStore } from '@/stores/usersStore';


const roomsStore = useRoomsStore();
const usersStore = useUsersStore();

const {
  selectedRoom,
} = storeToRefs(roomsStore);
const {
  currentUser
} = storeToRefs(usersStore);

const canWrite = computed(() => {
  const room = selectedRoom.value;

  if (!room) {
    return false;
  }

  return currentUser.value?.roomRights?.get(room.id)?.can_write ?? false;
});

const messages = computed(() => {
  const room = selectedRoom.value;

  if (!room) {
    return false;
  }

  return room.messages;
});
</script>

<template>
<template v-if="selectedRoom">

  <ChatHeader
    :room="selectedRoom" />

  <MessageList
    :messages="messages" />

  <ChatInput
    v-if="canWrite"
    :room="selectedRoom" />

</template>
</template>

<style scoped>

</style>
