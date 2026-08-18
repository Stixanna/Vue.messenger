<script setup>
import { computed } from 'vue';
import MessageReply from '@/components/messages/MessageReply.vue';
import Avatar from '@/components/Avatar.vue';
import MessageAttachments from '@/components/messages/MessageAttachments.vue';
import MessageReactions from '@/components/messages/MessageReactions.vue';
import MessageForward from '@/components/messages/MessageForward.vue';
import { useUsersStore } from '@/stores/usersStore';
import { formatTimestamp } from '@/utils/formatTimestamp';
import { formatTextWithLinks } from '@/utils/formatTextWithLinks';

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
});

const LINK_CONFIRMATION_TEXT = 'Осуществить переход по внешней ссылке?';

function confirmLink(event, url) {
  if (!window.confirm(`${LINK_CONFIRMATION_TEXT}\n${url}`)) {
    event.preventDefault();
  }
}

const usersStore = useUsersStore();

const currentUser = computed(() => {
  return usersStore.currentUser;
});

const isOutgoing = computed(() => {
  return props.message.is_outgoing 
    ?? currentUser.value?.id === props.message.from?.id;
});

const timestamp = computed(() => {
  return formatTimestamp(
    props.message.timestamp,
  );
});

const updatedTimestamp = computed(() => {
  return props.message.updated_at ?
    formatTimestamp(props.message.updated_at) :
    null;
});

const messageClasses = computed(() => ({
  'is-out': isOutgoing.value,
  'is-in': !isOutgoing.value,
  system: !props.message.from,
}));

const textParts = computed(() => {
  return formatTextWithLinks(
    props.message.text,
  );
});

const isFileMessage = computed(() => {
  const first = props.message.attachments?.[0];

  if (!first) {
    return false;
  }

  return !first.type.startsWith('image/');
});

const emit = defineEmits([
  'contextmenu',
]);

function handleMessageContextMenu(event) {
    event.preventDefault();

    emit('contextmenu', {
      item: props.message,
      event,
    });
}
</script>

<template>
<div
  class="bubble"
  :class="messageClasses"
  :data-mid="message.id"
  :data-peer-id="message.from?.id ?? 'systemid'"
  :data-timestamp="message.timestamp"
  :data-is-forwarded="message.is_forwarded || null"
  :data-read="message.is_read ? 'true' : 'false'"
  @contextmenu="handleMessageContextMenu"
>

  <template v-if="message.from">

    <Avatar
      v-if="!isOutgoing"
      :user="message.from" />

    <div
      class="bubble-content-wrapper">

      <div
        class="bubble-content">

        <div
          v-if="!isOutgoing"
          class="message-title-wrapper">
          <span class="message-title">
            {{ message.from.full_name }}
          </span>
        </div>

        <MessageReply
          v-if="message.in_reply_to"
          :message="message" />

        <MessageForward
          v-else-if="message.forwarded_from_user_id"
          @click=""
          :user-id="message.forwarded_from_user_id" />

        <MessageAttachments
          v-if="message.attachments?.length"
          :attachments="message.attachments"
          :editable="isOutgoing" />

        <div
          class="message"
          :class="{
            'no-text': !message.text,
            'with-reactions': message.reactions?.length > 0,
            file: isFileMessage,
          }">

          <template v-for="(part, index) in textParts" :key="index">
            <span v-if="part.type === 'text'">
              {{ part.value }}
            </span>

            <a v-else 
              :href="part.value" 
              target="_blank"
              rel="noopener noreferrer"
              @click="confirmLink($event, part.value)"
            >
              {{ part.value }}
            </a>

          </template>

          <div
            class="metainfo">

            <MessageReactions
              v-if="message.reactions?.length"
              :reactions="message.reactions"
              :message-id="message.id" />

            <span class="time">

              <!-- невидимый элемент для выравнивания текста -->
              <span v-if="message.text">
                {{
                  updatedTimestamp
                    ? `изменено: ${updatedTimestamp.time}`
                    : timestamp.time
                }}
              </span>

              <div
                class="time-inner"
                :title="
                  updatedTimestamp
                    ? `${timestamp.datetime}\nИзменено: ${updatedTimestamp.datetime}`
                    : timestamp.datetime
                ">

                <div
                  class="background" />

                <span>
                  {{
                    updatedTimestamp
                      ? `изменено: ${updatedTimestamp.time}`
                      : timestamp.time
                  }}
                </span>

              </div>

            </span>

          </div>

        </div>

      </div>

    </div>

  </template>

  <template v-else>

    <div
      class="system-message-wrapper">
      <span>
        {{ message.text }}
      </span>
    </div>

  </template>

</div>
</template>

<style scoped>

.bubble #embedded-message-container,
.bubble #forwarded-container {
  --font-size: 0.8rem;
  font-size: var(--font-size);
}

.bubble #forwarded-container span>span {
  cursor: pointer;
}

.bubble {
  --avatar-size: 2.5rem;
  --message-text-size: 16px;
  --messages-time-text-size: calc(var(--message-text-size) - 4px);
  position: relative;
  border-radius: inherit;
  margin: 0.2rem;
  align-self: flex-end;
  color: var(--text-color);
  overflow-wrap: break-word;
  max-width: 100%;
  display: flex;
  align-items: flex-end;
}

.bubble.system {
  justify-content: center;
}

.bubble.is-in {
  flex-direction: row;
}

.bubble.is-out {
  flex-direction: row-reverse;
}

.bubble.is-out .bubble-content {
  background-color: var(--message-background-color);
}

.bubble.is-in .bubble-content {
  background-color: var(--secondary-color);
}

.bubble-content {
  --border-radius: .625rem;
  min-width: 56px;
  max-width: 100%;
  border-start-start-radius: var(--border-radius);
  border-start-end-radius: var(--border-radius);
  border-end-start-radius: var(--border-radius);
  border-end-end-radius: var(--border-radius);
  box-shadow: 0 1px 2px #10232f26;
  position: relative;
}

.bubble .message {
  white-space: pre-wrap;
  pointer-events: auto;
}

.bubble-content-wrapper,
.bubble-content,
.message {
  user-select: text;
}

.bubble .message,
.bubble .message-title-wrapper {
  margin: 4px 8px 5px;
  max-width: 100%;
  word-break: break-word;
  position: relative;
}

.bubble .message.no-text {
  margin: 0 8px;
}

.bubble .message.no-text.file {
  height: 1.75rem;
}

.bubble::before,
.bubble.system::before {
  content: "";
  position: absolute;
  top: -0.1875rem;
  bottom: -0.1875rem;
  left: -50vw;
  right: -50vw;
  background: var(--highlight-color);
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.bubble.highlighted::before {
  opacity: 0.3;
}

.message-title-wrapper {
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bubble .message-title-wrapper {
  pointer-events: auto;
}

.message-title {
  font-weight: bold;
  color: var(--avatar-color);
  cursor: pointer;
}

.bubble-content-wrapper {
  display: flex;
  flex-direction: column;
  pointer-events: none;
}

.bubble.is-in .bubble-content-wrapper {
  max-width: min(calc(var(--max-content-width) - (var(--avatar-size) / 2)), 100%, var(--messages-container-width));
}

.bubble.is-out .bubble-content-wrapper {
  max-width: min(var(--max-content-width, 100%), var(--messages-container-width));
}

.bubble.is-out .time-inner {
  margin-inline-end: -2px;
}

.bubble .time-inner {
  pointer-events: all;
  position: relative;
  inset-inline-end: 0;
  display: flex;
  align-items: center;
  line-height: 1;
  padding: inherit;
  white-space: nowrap;
  height: var(--messages-time-text-size);
  visibility: visible;
  color: var(--message-time-color);
  bottom: 5px;
}

:root:not(.dark) .bubble.is-in .time-inner {
  color: var(--text-color);
}

.bubble .no-text .time-inner {
  position: absolute;
  z-index: 1;
  display: flex;
  justify-content: center;
  padding: 0.5rem 0.1rem;
  border-radius: var(--border-radius);
  color: var(--white);
}

.bubble .no-text.file .time-inner {
  color: var(--message-time-color);
}

.bubble .no-text .time-inner .background {
  position: absolute;
  height: 100%;
  width: 108%;
  z-index: -1;
  opacity: 0.3;
  background: black;
  border-radius: var(--border-radius);
}

.bubble .no-text.file .time-inner .background {
  background: none;
}

.bubble .time {
  visibility: hidden;
  font-size: var(--messages-time-text-size);
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  line-height: 1;
  vertical-align: middle;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: flex-end;
  z-index: 1;
  cursor: pointer;
  margin-inline-start: .1875rem;
  direction: ltr;
  float: right;
}

.metainfo {
  float: right;
  user-select: none;
}

.bubble .message.with-reactions .metainfo {
  width: 100%;
  display: flex;
  justify-content: space-between;
}


</style>
