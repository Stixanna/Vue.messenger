<script setup>
import ChatHeader from '@/components/layout/ChatHeader.vue';
import MessageList from '@/components/layout/MessageList.vue';
import ChatInput from '@/components/layout/ChatInput.vue';

const props = defineProps({
  room: {
    type: Object,
    required: true,
  },

  messages: {
    type: Array,
    required: true,
  },

  showInput: {
    type: Boolean,
    required: true,
  },
});
</script>

<template>
  <ChatHeader :room="room" />

  <MessageList :messages="messages" />

  <ChatInput
    v-if="showInput"
  />
</template>

<style scoped>

</style>