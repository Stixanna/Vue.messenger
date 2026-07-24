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
</script>

<template>
<div
  class="bubble"
  :class="messageClasses"
  :data-mid="message.id"
  :data-peer-id="message.from?.id ?? 'systemid'"
  :data-timestamp="message.timestamp"
  :data-is-forwarded="message.is_forwarded || null"
  :data-read="message.is_read ? 'true' : null">

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

            <!-- temp commented with error -->
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
