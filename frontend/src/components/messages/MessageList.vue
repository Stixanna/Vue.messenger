<script setup>
import { computed } from 'vue';
import MessageDateGroup from '@/components/messages/MessageDateGroup.vue';
import { groupMessages } from '@/utils/messages/groupMessages';


const props = defineProps({
  messages: {
    type: Array,
    default: [],
    // required: true,
  },
});

const groupedMessages = computed(() => {
  return groupMessages(
    props?.messages,
    5,
  );
});
</script>


<template>
<div
  id="chat"
  class="chat"
  data-menu-position-container
>
  <div
    id="chat-messages"
    class="message-list"
  >
    <MessageDateGroup
      v-for="group in groupedMessages"
      :key="group.date"
      :group="group"
    />
  </div>
</div>
</template>