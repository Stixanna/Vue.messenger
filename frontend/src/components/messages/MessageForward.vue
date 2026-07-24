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
