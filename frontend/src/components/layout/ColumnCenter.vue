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

</style>