<script setup>
import {
  ref,
} from 'vue';
import ContextMenu from '@/components/menus/ContextMenu.vue';
import BaseIcon from '../BaseIcon.vue';

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits([
  'select',
  'close',
]);

const menuOpened = ref(false);
const menuButton = ref(null);

function toggleMenu() {
  menuOpened.value = !menuOpened.value;
}

function onItemSelect(item) {
  emit('select', item);
  emit('close');
}
</script>

<template>
<div
  ref="menuButton"
  @click="toggleMenu"
  id="menu_btn"
  class="btn-container">

  <BaseIcon
    class="btn-icon"
    name="burger"
    element="div"
    package="tgico" />

  <ContextMenu
    name="slide-from-left"
    menu-id="main-context-menu"
    :opened="menuOpened"
    :items="items"
    :trigger-element="menuButton"
    @select="onItemSelect"
    @close="menuOpened = false" />
</div>
</template>

<style scoped>
.btn-icon {
  font-size: var(--font-size);
}

#menu_btn>.badge {
  position: absolute;
  left: 1.5rem;
  bottom: 0.3rem;
  font-size: 10px;
  padding: 2px;
  text-align: center;
  pointer-events: none;
}
</style>
