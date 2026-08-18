<script setup>
import { 
  watch, 
  onBeforeUnmount, 
} from 'vue';
import MenuItem from '@/components/menus/MenuItem.vue';

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  opened: {
    type: Boolean,
    required: true,
  },
  triggerElement: {
    type: Object,
    default: null,
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

function handleOutsideClick(event) {
  if (event.button !== 0) return;

  const target = event.target;

  // Клик по кнопке, которая открывает меню.
  if (
    props.triggerElement &&
    props.triggerElement.contains(target)
  ) {
    return;
  }

  emit('close');
}

watch(
  () => props.opened,
  (opened) => {
    if (opened) {
      window.addEventListener('click', handleOutsideClick);
    } 
    else {
      window.removeEventListener('click', handleOutsideClick);
    }
  },
);

onBeforeUnmount(() => {
  window.removeEventListener('click', handleOutsideClick);
});
</script>

<template>
<Transition
  name="slide-from-left"
  appear>
  <div
    v-if="opened"
    class="context-menu menu"
    style="z-index: 2;"
    @click.stop>
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
  cursor: auto;
  pointer-events: auto;
  color: var(--text-color);
  overflow-y: auto;
  overflow-x: hidden;
  top: 60px;
  left: 0;
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
