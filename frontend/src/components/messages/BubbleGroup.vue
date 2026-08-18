<script setup>
import MessageBubble from './MessageBubble.vue';


defineProps({
  group: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits([
  'contextmenu',
]);

function handleContextMenu({ item, event }) {
    event.preventDefault();

    emit('contextmenu', {
      item,
      event,
    });
}
</script>

<template>
<div
  class="bubbles"
  :class="{
    system: group.peerId === 'systemid'
  }">

  <MessageBubble
    v-for="message in group.messages"
    :key="message.id"
    :message="message" 
    @contextmenu="handleContextMenu" 
    />

</div>
</template>

<style scoped>
.bubbles {
  width: 100%;
  flex: 1 1 auto;
  position: relative;
  z-index: 0;
}

.bubbles {
  margin-block: 0.75rem;
}

.bubbles.system {
  padding-block: 0.75rem;
}
</style>
