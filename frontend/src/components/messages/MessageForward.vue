<script setup>
import { computed } from 'vue';
import BaseIcon from '@/components/BaseIcon.vue';
import { useUsersStore } from '@/stores/usersStore';

const emit = defineEmits([
  'click',
]);
const props = defineProps({
  userId: {
    type: [String, Number],
    required: true,
  },
});

const usersStore = useUsersStore();

const forwardedUser = computed(() => {
  return usersStore.getUserById(props.userId);
});

function handleUsernameClick() {
  console.log('username_click')
  emit('click', forwardedUser);
}
</script>

<template>
<div
  id="forwarded-container"
  class="forwarded-container no-selection"
  :data-forward-user-id="forwardedUser.id">
  <div
    class="btn-container">
    <BaseIcon
      class="btn-icon"
      name="forward" />
  </div>

  <span>
    Переслано от

    <span class="forwarded-name" @click="handleUsernameClick">
      {{ forwardedUser.full_name }}
    </span>
  </span>
</div>
</template>

<style scoped>

#forwarded-container {
  width: 100%;
  display: flex;
  pointer-events: auto;
  user-select: none;
}

.bubble .forwarded-container {
  padding: 0.25rem 0.5rem;
}

.forwarded-container {
  display: inline-block;
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: calc(var(--font-size) + 2px);
}

.forwarded-container .btn-container,
.forwarded-container span {
  pointer-events: none;
}

.bubble #forwarded-container span>span {
  cursor: pointer;
}
.forwarded-container span>.forwarded-name {
  pointer-events: auto;
}
</style>
