<script setup>
const emit = defineEmits(['resize-start']);

const handleMouseDown = (event) => {
  emit('resize-start', event);
};

const handleTouchStart = (event) => {
  emit('resize-start', event.touches[0]);
};
</script>

<template>
<div
  class="sidebar-resizer"
  @mousedown="handleMouseDown"
  @touchstart.prevent="handleTouchStart" />
</template>

<style scoped>
.sidebar-resizer {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 5px;
  cursor: col-resize;
  background: transparent;
  right: -4.5px;
  z-index: 100;
  user-select: none;
}

.sidebar-resizer::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(to right, #333 0%, #555 50%, #333 100%);
  left: 2px;
  z-index: 101;
}
</style>
