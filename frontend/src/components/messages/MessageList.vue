<script setup>
import {
  computed,
  nextTick,
  ref,
  watch,
} from 'vue';

import MessageDateGroup from '@/components/messages/MessageDateGroup.vue';
import ContextMenu from '../menus/ContextMenu.vue';

import { useRoomsStore } from '@/stores/roomsStore';
import { useUsersStore } from '@/stores/usersStore';
import { groupMessages } from '@/utils/messages/groupMessages';
import { menuText } from '@/constants/menuText';

const props = defineProps({
  roomId: {
    type: String,
    default: null,
  },

  messages: {
    type: Array,
    default: () => [],
  },
});

const roomsStore = useRoomsStore();
const usersStore = useUsersStore();

const containerElement = ref(null);

const groupedMessages = computed(() => {
  return groupMessages(props.messages, 5);
});

/*
 * Chat scroll
 */
const initialScrollDone = ref(false);

function scrollToUnreadMessage(container, unreadMessage) {
  const containerRect = container.getBoundingClientRect();
  const messageRect = unreadMessage.getBoundingClientRect();

  const messageTop =
    container.scrollTop +
    (messageRect.top - containerRect.top);

  container.scrollTop = messageTop - container.clientHeight + unreadMessage.offsetHeight / 2;
}

function scrollToBottom(container) {
  container.scrollTop = container.scrollHeight;
}

function scrollToInitialPosition() {
  const container = containerElement.value;

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

/*
 * Context menu
 */
const menuOpened = ref(false);
const contextMenuMessage = ref(null);
const menuOpenEvent = ref(null);

const menuItems = computed(() => {
  const message = contextMenuMessage.value;

  if (!message) {
    return [];
  }

  const messageTimestamp = new Date(message.timestamp).getTime();
  const isMessageDelayed = Date.now() < messageTimestamp;

  const messageOwnerId = message.from?.id;
  const isSystemMessage = !messageOwnerId;
  const isUserMessageOwner =
    messageOwnerId === usersStore.currentUser?.id;

  const currentUserRights =
    usersStore.currentUser?.roomRights.get(
      roomsStore.selectedRoom?.id,
    );

  const isCurrentUserModeratorOrCreator =
    currentUserRights?.is_modder ||
    currentUserRights?.is_creator;

  const isMessageNotForwarded = !message.is_forwarded;

  // const reaction_list = [];
  // const ownReactions = messageBubble.querySelectorAll('.message-reactions .message-reaction.is-own');
  // ownReactions.forEach(element => {
  //     const reaction_emoji = element.dataset.reaction;
  //     reaction_list.push(reaction_emoji);
  // });
  // const supportedReactions = [
  //     { unicode: 'U+2764;', id: 'heart', emoji: '❤️', is_selected: reaction_list.includes('❤️') },
  //     { unicode: 'U+1F44D', id: 'like', emoji: '👍', is_selected: reaction_list.includes('👍') },
  //     { unicode: 'U+1F44E', id: 'dislike', emoji: '👎', is_selected: reaction_list.includes('👎') },
  //     { unicode: 'U+2705', id: 'success', emoji: '✅', is_selected: reaction_list.includes('✅') },
  //     { unicode: 'U+1F91D', id: 'handshake', emoji: '🤝', is_selected: reaction_list.includes('🤝') },
  //     { unicode: 'U+274C', id: 'cross', emoji: '❌', is_selected: reaction_list.includes('❌') },
  // ];
  const items = [
    // !isMessageDelayed && !isSystemMessage
    //   ? { id: "add_reaction", value: supportedReactions, before_placement: true }
    //   : null,
    !isMessageDelayed
      ? {
          id: 'reply_message',
          icon: 'reply',
          value: menuText.message.replyMessage,
        }
      : null,

    !isMessageDelayed &&
    isUserMessageOwner &&
    isMessageNotForwarded
      ? {
          id: 'edit_message',
          icon: 'edit',
          value: menuText.message.editMessage,
        }
      : null,

    {
      id: 'copy_message',
      icon: 'copy',
      value: menuText.message.copyMessage,
    },

    !isMessageDelayed
      ? {
          id: 'forward_message',
          icon: 'forward',
          value: menuText.message.forwardMessage,
        }
      : null,

    isUserMessageOwner || isCurrentUserModeratorOrCreator
      ? {
          id: 'delete_message',
          icon: 'trashcan',
          value: menuText.message.deleteMessage,
        }
      : null,
  ];

  return items.filter(Boolean);
});

function handleMessageContextMenu({ item, event }) {
  contextMenuMessage.value = item;
  menuOpenEvent.value = event;
  menuOpened.value = true;
}

function handleMenuClose() {
  menuOpened.value = false;
  contextMenuMessage.value = null;
  menuOpenEvent.value = null;
}

function handleMenuItemSelect(item) {
  console.log('Selected menu item:', item);
  console.log(
    'Selected contextMenuMessage:',
    contextMenuMessage.value,
  );

  handleMenuClose();
}

/*
 * Reset initial scroll when changing room.
 */
watch(
  () => props.roomId,
  () => {
    initialScrollDone.value = false;
  },
);

/*
 * Scroll to unread message / bottom after the initial messages
 * have been rendered.
 */
watch(
  () => props.messages,
  async (messages) => {
    if (!messages.length || initialScrollDone.value) {
      return;
    }

    await nextTick();

    scrollToInitialPosition();

    initialScrollDone.value = true;
  },
  {
    flush: 'post',
  },
);
</script>

<template>
  <div
    id="chat"
    ref="containerElement"
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
        @contextmenu="handleMessageContextMenu"
      />
    </div>

    <ContextMenu
      name="slide-from-left"
      menu-id="message-context-menu"
      :opened="menuOpened"
      :items="menuItems"
      :open-event="menuOpenEvent"
      :container-element="containerElement"
      @select="handleMenuItemSelect"
      @close="handleMenuClose"
    />
  </div>
</template>

<style scoped>
.message-list {
  --max-content-width: min(
    100% - var(--chat-input-padding) * 2,
    var(--messages-container-width) * 2
  );
  --action-message-bg: #0A0A0A8C;
  --message-text-size: 16px;

  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  margin-bottom: 0.5rem;
  justify-content: flex-end;
  max-width: min(
    100% - var(--chat-input-padding) * 2,
    var(--messages-container-width) * 2
  );
}
</style>