<script setup>
defineProps({
  messages: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
<div
  id="chat"
  class="chat"
  data-menu-position-container>
  <div
    id="chat-messages"
    class="message-list">
    <!-- потом здесь будет MessageList -->
  </div>
</div>
</template>

<style scoped>

</style>