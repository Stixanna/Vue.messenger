<script setup>
import ActiveRoom from '@/components/layout/ActiveRoom.vue';
</script>

<template>
<div
  id="column-center">
  <ActiveRoom />
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
