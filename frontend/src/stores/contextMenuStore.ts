import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useContextMenuStore = defineStore('contextMenu', () => {
  const activeMenuId = ref<string | null>(null);

  function openMenu(menuId: string) {
    activeMenuId.value = menuId;
  }

  function closeMenu(menuId: string) {
    if (activeMenuId.value === menuId) {
      activeMenuId.value = null;
    }
  }

  return {
    activeMenuId,
    openMenu,
    closeMenu,
  };
});