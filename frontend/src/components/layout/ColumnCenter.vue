<script setup>
import ActiveRoom from '@/components/layout/ActiveRoom.vue';

const props = defineProps({
  currentRoom: {
    type: Object,
    default: null,
    // default: {name: 'room'},
  },

  messages: {
    type: Array,
    default: () => [],
  },

  showInput: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
<div
  id="column-center">

  <ActiveRoom
    v-if="currentRoom"
    :room="currentRoom"
    :messages="messages"
    :show-input="showInput" />

</div>
</template>

<style scoped>
#column-center {
  --border-radius-messages: 0.9375rem;
  --messages-container-width: 43rem;
  --right-column-width: 26.5rem;
  --chat-input-padding: .8125rem;
}

#column-center {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
