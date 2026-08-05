<script setup>
import { computed } from 'vue';
import { useUsersStore } from '@/stores/usersStore';
import Avatar from '@/components/Avatar.vue';


const props = defineProps({
  reaction: {
    type: Object,
    required: true,
  },
});

const usersStore = useUsersStore();

const reactedUser = computed(() => {
  return usersStore.getUserById(
    props.reaction.user_id,
  );
});

const currentUserId = computed(() => {
  return usersStore.currentUser?.id;
});

const isOwnReaction = computed(() => {
  return (
    currentUserId.value &&
    currentUserId.value === props.reaction.user_id
  );
});

const emit = defineEmits([
  'click',
]);

function handleClick() {
  emit('click');
}

const classes = computed(() => ({
  'message-reaction': true,
  'is-own': isOwnReaction.value,
}));
</script>

<template>
<div
  v-if="reactedUser"
  :class="classes"
  :data-user-id="reaction.user_id"
  :data-reaction="reaction.symbol"
  :data-timestamp="reaction.timestamp"
  @click="handleClick">

  <Avatar
    :text="reactedUser.full_name"
    :user-id="reactedUser.id" />

  <span class="message-reaction-emoji">
    {{ reaction.symbol }}
  </span>

</div>
</template>

<style scoped>
.message-reaction {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 22px;
  height: 20px;
  padding: 1rem 6px;

  border-radius: 12px;

  font-size: 14px;
  line-height: 1;

  background: rgba(0, 0, 0, 0.08);
  cursor: pointer;

  transition:
    background-color 120ms ease,
    transform 120ms ease;
}

.message-reaction:hover {
  background: rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

.bubble.is-out .message-reaction.is-own {
  background: var(--message-time-color);
}

.message-reaction.is-own {
  background: var(--primary-color);
}

.message-reaction-emoji {
  height: 0.5rem;
  margin-bottom: .15rem;
  pointer-events: none;
}
</style>
