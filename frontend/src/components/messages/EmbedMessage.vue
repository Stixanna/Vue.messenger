<script setup>
import {
  computed
} from 'vue';
import BaseIcon from '@/components/BaseIcon.vue';
import EmbedMessageInner from './EmbedMessageInner.vue';

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },

  embedType: {
    type: String,
    // default: 'reply',
  },
});

const embedMessage = computed(() => {
  return props.message;
});

function embedCancel() {
  emit('cancel');
}

const emit = defineEmits([
  'click',
  'cancel',
]);

function handleClick() {
  emit('click', props.message.in_reply_to);

}
</script>

<template>
<div
  id="embedded-message-container"
  class="embedded-message-container"
  :type="embedType"
  @click="handleClick">

  <div
    class="embedded-message-icon-text">
    <BaseIcon
      v-if="embedType"
      class="btn-container btn-icon"
      :name="embedType"
      id="embedded-left-icon" />

    <EmbedMessageInner
      :message="embedMessage" />

  </div>

  <div
    v-if="embedType"
    ref="menuButton"
    id="embedded-cancel"
    class="btn-container btn-icon"
    @click.stop
    @click="embedCancel">
    <BaseIcon
      class="embedded-cancel"
      name="close" />
  </div>

</div>
</template>

<style scoped>
.bubble .embedded-message-container {
  --embed-height: 2.5rem;
  --border-size: .4rem;

  margin: 0.4rem;
  cursor: pointer;
}

.embedded-message-icon-text {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

#embedded-left-icon {
  --font-size: 2rem;
  --text-color: var(--avatar-color);
}

.chat-input #embedded-left-icon {
  position: relative;
  top: 1rem;
  left: 1rem;
  bottom: var(--border-radius-messages);
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  font-size: var(--font-size);
  color: var(--text-color);
  pointer-events: none;
}

.chat-input .embedded-cancel {
  --text-color:var(--avatar-color);
  position: relative;
  top: 1rem;
  right: 1rem;
  bottom: var(--border-radius-messages);
  background: none;
  border: none;
  /* font-size: 1.5rem; */
  cursor: pointer;
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
