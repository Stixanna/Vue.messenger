<script setup>
import { computed } from 'vue';
import ScheduledMessagesButton from './ScheduledMessagesButton.vue';
import AttachmentAddButton from './AttachmentAddButton.vue';
import SendButton from './SendButton.vue';

const props = defineProps({
  room: {
    type: Object,
    required: true,
  },
  inputValue: {
    type: String,
    default: ''
  }
});

const showScheduledButton = computed(() => {
  return (
    props.room &&
    props.room.delayed_messages > 0 &&
    props.inputValue === ''
  );
});
</script>

<template>
<div
  id="chat-input"
  class="chat-input">
  <div
    id=""
    class="chat-footer-wrapper">
    <div
      id="input-wrapper"
      class="textarea-wrapper">
      <div
        id="chat-input-buttons"
        class="chat-input-buttons">

        <ScheduledMessagesButton
          v-if="showScheduledButton" />

        <AttachmentAddButton />

      </div>
      <textarea 
        id="message-input" 
        spellcheck="false" 
        type="text" 
        autocomplete="off" 
        maxlength="1000" 
        placeholder="Write a message..." 
        data-scroll-element="true" />
    </div>

    <SendButton />
  </div>
</div>
</template>

<style scoped>

</style>
