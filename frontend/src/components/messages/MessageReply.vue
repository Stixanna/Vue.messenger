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

  embedType: {
    type: String,
    // default: 'reply',
  },
});

const embedMessage = computed(() => {
  return props.message.replied_message;
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
  if (isNotFound.value) {
    return '---';
  }

  return embedMessage.value.text;
});

const hasAttachment = computed(() => {
  return embedMessage.value?.attachments?.length > 0;
});

const emit = defineEmits([
  'click',
]);

function handleClick() {
  console.log('reply_click')
  emit('click', props.message.in_reply_to);
  // const repliedId = props.message.in_reply_to;

  // const target = document.querySelector(
  //   `[data-mid="${repliedId}"]`,
  // );

  // if (target) {
  //   highlightMessage(target);
  //   return;
  // }

  // scrollIntoMessage({
  //   id: repliedId,
  // });
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
      v-if="embedType && !isNotFound"
      :name="embedType"
      id="embedded-left-icon" />
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

  </div>

</div>
</template>
