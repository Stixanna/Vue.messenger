<script setup>
import MenuItem from '@/components/menus/MenuItem.vue';

defineProps({
  items: {
    type: Array,
    required: true,
  },
  opened: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits([
  'select',
  'close',
]);

function handleItemClick(item) {
  emit('select', item);
  emit('close');
}
</script>

<template>
<Transition
  name="slide-from-left"
  appear>
  <div
    v-if="opened"
    class="context-menu menu"
    style="z-index: 2;">
    <MenuItem
      v-for="item in items"
      :key="item.id"
      :item="item"
      @click="handleItemClick" />
  </div>
</Transition>
</template>

<style scoped>
.context-menu {
  position: absolute;
  pointer-events: auto;
  color: var(--text-color);
  overflow-y: auto;
  overflow-x: hidden;
  top: 60px;
  max-width: var(--sidebar-width);
  display: flex;
  flex-direction: column;
}

.context-menu[type="message_menu"] {
  gap: .5rem;
  align-items: center;
}

.slide-from-left-enter-active,
.slide-from-left-leave-active {
  transition:
    opacity .3s ease,
    transform .3s ease;
}

.slide-from-left-enter-from,
.slide-from-left-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.slide-from-left-enter-to,
.slide-from-left-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.menu {
  background-color: var(--secondary-bright-color);
  border-radius: var(--border-radius-default);
}

.menu[data-position="0"] {
  border-radius: 20px;
}
</style>
