<script setup>
import { computed } from 'vue';
const props = defineProps({
  room: {
    type: Object,
    required: true,
  },
});

const avatarLetter = computed(() => {
  return props.room?.name?.[0]?.toUpperCase() ?? '';
});
</script>

<template>
<div
  class="chat-header">
  <div
    class="chat-info">
    <div
      class="avatar no-photo">
      <div
        class="inner">
        {{ avatarLetter }}
      </div>
    </div>

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
    class="chat-buttons" />
</div>
</template>

<style scoped>

</style>