<script setup lang="ts">
import { computed, ref } from 'vue';
import LeftColumnHeader from '@/components/layout/LeftColumnHeader.vue';
import LeftColumnRowList from '@/components/layout/LeftColumnRowList.vue';
import SortButton from '@/components/layout/SortButton.vue';
import SidebarResizer from '@/components/layout/SidebarResizer.vue';
import { useSettingsStore } from '@/stores/settingsStore';
import { useSidebarResize } from '@/composables/useSidebarResize';


const settingsStore = useSettingsStore();

defineProps({
  treeView: {
    type: Boolean,
    default: false,
  },

  showSharedTags: {
    type: Boolean,
    default: false,
  },
});

const sidebar = ref < HTMLElement | null > (null);

const {
  handleResizeStart,
} = useSidebarResize(sidebar);

const roomResort = computed({
  get() {
    return settingsStore.isRoomsResorted;
  },

  set(value: boolean) {
    settingsStore.updateSetting(
      'isRoomsResorted',
      value,
    );
  },
});

function handleClick() {
  roomResort.value = !roomResort.value;
}
</script>

<template>
<div
  id="column-left"
  data-search-parent-container
  ref="sidebar">
  <LeftColumnHeader
    :treeView="treeView"
    :showSharedTags="showSharedTags" />

  <LeftColumnRowList
    :treeView="treeView"
    :showSharedTags="showSharedTags"
    :roomResort="roomResort" />

  <SidebarResizer
    @resize-start="handleResizeStart" />

  <SortButton
    @click="handleClick"
    :orderToBot="roomResort" />

</div>
</template>

<style scoped>
#column-left {
  position: relative;
  display: flex;
  flex-direction: column;
  width: var(--sidebar-width);
  max-width: 624px;
  height: 100vh;
  background: var(--secondary-color);
}
</style>
