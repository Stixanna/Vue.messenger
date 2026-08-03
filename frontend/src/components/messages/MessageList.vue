<script setup>
import { computed } from 'vue';
import MessageDateGroup from '@/components/messages/MessageDateGroup.vue';
import { groupMessages } from '@/utils/messages/groupMessages';
import { ref, watch, nextTick } from 'vue';


const props = defineProps({
  roomId: {
    type: String,
    default: null,
  },
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

const chatRef = ref(null);
const initialScrollDone = ref(false);

function scrollToUnreadMessage(container, unreadMessage) {
  const containerRect = container.getBoundingClientRect();
  const messageRect = unreadMessage.getBoundingClientRect();

  const top =
    container.scrollTop +
    (messageRect.top - containerRect.top);

  container.scrollTop =
    top
    - container.clientHeight
    + unreadMessage.offsetHeight / 2;
}

function scrollToBottom(container) {
  container.scrollTop = container.scrollHeight;
}

function scrollToInitialPosition() {
  const container = chatRef.value;

  if (!container) {
    return;
  }

  const unreadMessage = container.querySelector(
    '.bubble[data-read="false"]',
  );

  if (unreadMessage) {
    scrollToUnreadMessage(
      container,
      unreadMessage,
    );

    return;
  }

  scrollToBottom(container);
}

watch(
  () => props.roomId,
  () => {
    initialScrollDone.value = false;
  },
);

watch(
  () => props.messages,
  async (messages) => {
    if (!messages.length || initialScrollDone.value) {
      return;
    }

    // Если в процессе выполнения callback еще есть ожидающие обновления Vue, дождись их
    await nextTick();

    scrollToInitialPosition();

    initialScrollDone.value = true;
  },
  {
    // Запусти callback после обновления DOM.
    flush: 'post',
  },
);

</script>


<template>
<div
  id="chat"
  class="chat"
  ref="chatRef"
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