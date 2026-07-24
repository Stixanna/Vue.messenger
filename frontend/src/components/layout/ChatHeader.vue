<script setup>
import { computed } from 'vue';
import Avatar from '../Avatar.vue';
import CallButton from './CallButton.vue';

const props = defineProps({
  room: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits([
  'click',
]);

function handleClick() {
  console.log('chat_header_click');
  emit('click');
}

const showCallButton = computed(() => {
  return props.room?.details?.users.length > 1;
});
const avatarLetter = computed(() => {
  return props.room?.name?.[0]?.toUpperCase() ?? '';
});
</script>

<template>
<div
  @click="handleClick"
  class="chat-header">
  <div
    class="chat-info">
    <Avatar
      :text=avatarLetter />

    <div
      class="chat-header-text">
      <div
        class="chat-header-name">
        {{ room?.name }}
      </div>

      <div
        class="smalltext">
        {{ room?.status }}
      </div>
    </div>
  </div>

  <div
    class="chat-buttons">
    <CallButton
      v-if="showCallButton" />
  </div>
</div>
</template>

<style scoped>
.chat-buttons {
  display: flex;
  align-items: center;
}
</style>
