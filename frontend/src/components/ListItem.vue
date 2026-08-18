<script setup>
import {
  computed,
} from 'vue';
import {
  formatRelativeTime
} from '@/utils/formatRelativeTime';
import {
  useNow
} from '@/composables/useNow';
import Avatar from '@/components/Avatar.vue';
import TagBadge from '@/components/TagBadge.vue';
import BaseIcon from '@/components/BaseIcon.vue';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },

  activateItems: {
    type: Boolean,
    default: true,
  },

  isTags: {
    type: Boolean,
    default: true,
  },

  isKeywords: {
    type: Boolean,
    default: true,
  },

  isTitle: {
    type: Boolean,
    default: true,
  },

  isSubtitle: {
    type: Boolean,
    default: true,
  },

  isTime: {
    type: Boolean,
    default: true,
  },

  isUnreadBadge: {
    type: Boolean,
    default: true,
  },

  isColoredAvatars: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  'click',
  'contextmenu',
  // 'dblclick',
]);

function handleClick() {
  emit('click', props.item);
}

function handleContextMenu(event) {
  event.preventDefault();

  emit('contextmenu', {
    item: props.item,
    event,
  });
}

const isMessage = computed(() => props.item.is_message);

const roomId = computed(() =>
  isMessage.value ?
  props.item.room.id :
  props.item.id
);

const avatarTitle = computed(() =>
  isMessage.value ?
  props.item.from.full_name :
  props.item.name
);

const now = useNow();

const relativeDate = computed(() => {
  now.value;
  const lastMsg = props.item.last_message;
  const time = lastMsg
    ? formatRelativeTime(lastMsg.timestamp)
    : `Созд. ${formatRelativeTime(props.item.created_at)}`;

  return time;
});
</script>

<template>
<div
  class="chat-item"
  :class="{ active: item.selected && activateItems }"
  :data-room-id="roomId"
  @click="handleClick"
  @contextmenu="handleContextMenu">

  <!-- Avatar -->
  <Avatar
    :text=avatarTitle
    :color-source="isColoredAvatars ? item.id : undefined" />

  <div
    class="chat-item-right">

    <!-- Tags -->
    <div
      v-if="isTags && (item.tags?.length || item.keywords?.length)"
      class="chat-text tag-list-wrapper">

      <div
        v-if="isKeywords"
        class="tag-list shared">

        <TagBadge
          v-for="keyword in item.keywords"
          :key="keyword.name"
          :tag="keyword" />
      </div>

      <div
        class="tag-list">
        <TagBadge
          v-for="tag in item.tags"
          :key="tag.tag_id"
          :tag="tag" />
      </div>

    </div>

    <!-- Top -->
    <div
      v-if="isTitle"
      class="chat-text chat-text-top">

      <div
        class="chat-text-left">
        {{ item.name }}
      </div>

      <div
        v-if="isTime"
        id="last-msg-date"
        class="chat-text-right"
        :data-timestamp="item.timestamp">

        {{ relativeDate }}
      </div>

    </div>

    <!-- Bottom -->
    <div
      v-if="isSubtitle"
      class="chat-text chat-text-bottom">

      <div
        class="chat-text-left">

        <BaseIcon
          name="file"
          v-if="item.last_message?.is_attachments" />

        <span v-if="item.last_message?.text">
          {{ item.last_message.text }}
        </span>

      </div>

      <TagBadge
        class="notify-red"
        v-if="item.unread_count && isUnreadBadge"
        :tag="{ name: item.unread_count }" />

    </div>

  </div>

</div>
</template>

<style scoped>

</style>
