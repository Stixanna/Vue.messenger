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
  <div id="column-center">

    <div class="chat-background">
      <div class="chat-theme-overlay" />
    </div>

    <ActiveRoom
      v-if="currentRoom"
      :room="currentRoom"
      :messages="messages"
      :show-input="showInput"
    />

  </div>
</template>

<style scoped>

.chat-background {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image: url('../../assets/chat-background.jpg');
  background-size: cover;
  background-position: center;
  pointer-events: none;
}
.chat-theme-overlay {
  position: absolute;
  inset: 0;
  background-color: var(--tertiary-color);
  opacity: 0.96;
  pointer-events: none;
}

#column-center {
  --border-radius-messages: 0.9375rem;
  --messages-container-width: 43rem;
  --right-column-width:26.5rem;
  --chat-input-padding:.8125rem;
}

#column-center {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

</style>