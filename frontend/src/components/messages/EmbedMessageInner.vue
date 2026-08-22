<script setup>
import { computed } from 'vue';
import BaseIcon from '@/components/BaseIcon.vue';
// import { highlightMessage } from '@/utils/messages/highlightMessage';
// import { scrollIntoMessage } from '@/utils/messages/scrollIntoMessage';


const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
});

const embedMessage = computed(() => {
  return props.message;
});

const isNotFound = computed(() => {
  return !embedMessage.value;
});

const title = computed(() => {
  if (isNotFound.value) {
    return 'Не найдено';
  }

  return embedMessage.value.from?.full_name ?? 'Система';
});

const text = computed(() => {
  // console.log(props.message)
  if (isNotFound.value) {
    return '---';
  }

  return embedMessage.value.text;
});

const hasAttachment = computed(() => {
  return embedMessage.value?.attachments?.length > 0;
});

// const emit = defineEmits([
//   'click',
// ]);

// function handleClick() {
//   console.log('reply_click')
//   emit('click', props.message.in_reply_to);
//   // const repliedId = props.message.in_reply_to;

//   // const target = document.querySelector(
//   //   `[data-mid="${repliedId}"]`,
//   // );

//   // if (target) {
//   //   highlightMessage(target);
//   //   return;
//   // }

//   // scrollIntoMessage({
//   //   id: repliedId,
//   // });
// }
</script>

<template>
<div
  class="embedded-message">

  <div
    class="hover-effect" />

  <div
    class="embed-text-wrapper no-selection">

    <div
      class="embed-text-title">
      {{ title }}
    </div>

    <div
      class="embed-text-text">

      <BaseIcon
        v-if="hasAttachment"
        name="image"
        id="embedded-left-icon" />

      <span>
        {{ text }}
      </span>

    </div>

  </div>

</div>
</template>

<style scoped>

.chat-input .embedded-message {
  position: relative;
  top: 0.5rem;
  width: 100%;
  margin-inline: 1.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.embed-text-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  pointer-events: none;
  padding: 0.5rem;
  border-left: 4px solid var(--avatar-color);
  border-radius: 0.25rem;
}

.chat-input .embedded-message .embed-text-wrapper {
  margin-bottom: 0.5rem;
}

.bubble .embedded-message {
  height: var(--embed-height);
  /* не понимаю почему нормально не наследуется ширина */
  max-width: calc(100% - var(--border-size) - .2rem);
}

.bubble #embedded-message-container .hover-effect {
  height: inherit;
  /* не понимаю почему нормально не наследуется ширина */
  max-width: calc(100% - var(--border-size) - .2rem);
}

.bubble #embedded-message-container {
  --icon-size: 1rem;
  --embed-height: 2.5rem;
  --border-size: .4rem;
}

.bubble #embedded-message-container {
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

.embed-text-title{
  color: var(--text-color);
}
.bubble .embed-text-title {
  color: var(--message-time-color);
  font-weight: bold;
}

/* .chat-input #embedded-left-icon {
  position: relative;
  top: 1rem;
  left: 1rem;
  bottom: var(--border-radius-messages);
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-color);
  pointer-events: none;
} */

.embedded-message .hover-effect {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: var(--avatar-color);
  border-radius: 0.25rem;
  opacity: 0.1;
  pointer-events: none;
}

.bubble .embedded-message .hover-effect {
  opacity: 0.15;
  background-color: var(--message-time-color);
}

.bubble .embedded-message .embed-text-wrapper {
  border-left: 4px solid var(--message-time-color);
}

.embed-text-text span {
  /* bottom а вышлядит как middle idk */
  vertical-align: bottom;
}

</style>
