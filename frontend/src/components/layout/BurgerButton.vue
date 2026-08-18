<script setup>
import {
  ref,
  computed,
} from 'vue';
import { useContextMenuStore } from '@/stores/contextMenuStore';
import ContextMenu from '@/components/menus/ContextMenu.vue';
import BaseIcon from '../BaseIcon.vue';

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const contextMenuStore = useContextMenuStore();
const menuId = 'main-context-menu';

const emit = defineEmits([
  'select',
  'close',
]);

const menuButton = ref(null);

const menuOpened = computed(() => {
  return contextMenuStore.activeMenuId === menuId;
});

function toggleMenu() {
  if(menuOpened.value) {
    contextMenuStore.closeMenu(menuId);
  } else {
    contextMenuStore.openMenu(menuId);
  }
}

function handleMenuClose() {
  contextMenuStore.closeMenu(menuId);
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
    :menu-id="menuId"
    :opened="menuOpened"
    :items="items"
    :trigger-element="menuButton"
    @select="onItemSelect"
    @close="handleMenuClose" />
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
