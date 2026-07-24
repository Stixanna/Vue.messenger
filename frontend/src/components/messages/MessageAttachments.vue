<script setup>
import MessageAttachment from './MessageAttachment.vue';


defineProps({
  attachments: {
    type: Array,
    required: true,
  },
});
</script>

<template>
<div
  class="message-attachments">

  <template v-for="attachment in attachments" :key="attachment.id">
    <MessageAttachment
      :attachment="attachment" />

  </template>

</div>
</template>
