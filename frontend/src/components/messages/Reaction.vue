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
