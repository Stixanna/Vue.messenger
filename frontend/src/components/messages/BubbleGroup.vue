<script setup>
import MessageBubble from './MessageBubble.vue';


defineProps({
  group: {
    type: Object,
    required: true,
  },
});
</script>

<template>
<div
  class="bubbles"
  :class="{
    system: group.peerId === 'systemid'
  }">

  <MessageBubble
    v-for="message in group.messages"
    :key="message.id"
    :message="message" />

</div>
</template>
