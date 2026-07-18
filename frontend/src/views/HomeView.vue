<script setup>
import ColumnLeft from '@/components/layout/ColumnLeft.vue';
import ColumnCenter from '@/components/layout/ColumnCenter.vue';
import ColumnRight from '@/components/layout/ColumnRight.vue';
</script>

<template>
<div
  id="Main"
  class="app-container">
  <div
    class="chat-background">
    <div
      class="chat-theme-overlay" />
  </div>

  <ColumnLeft />
  <ColumnCenter />
  <ColumnRight />
</div>
</template>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  width: 100%;
}

.chat-background {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image: url('../assets/chat-background.jpg');
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
</style>
