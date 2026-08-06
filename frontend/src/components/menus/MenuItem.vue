<script setup>
import {
  computed
} from 'vue';
import BaseIcon from '../BaseIcon.vue';
import ToggleSwitch from '../ToggleSwitch.vue';

import {
  useSettingsStore
} from '@/stores/settingsStore';

const settingsStore = useSettingsStore();

const themeChange = computed({
  get() {
    return settingsStore.theme === 'dark';
  },

  set(value) {
    settingsStore.updateSetting(
      'theme',
      value ? 'dark' : 'light',
    );
  },
});

defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits([
  'click',
]);

function initRowClick(item) {
  emit('click', item);
}
</script>

<template>
<div
  v-if="!item.type || item.type === 'sidebar_open'"
  :id="item.id"
  class="menu-item nowrap pointer"
  :type="item.type"
  @click="initRowClick(item)">
  <div
    class="flex">

    <BaseIcon
      class="menu-item-icon"
      :name="item.icon"
      element="span"
      package="tgico" />

    <span class="menu-item-text">
      {{ item.value }}
    </span>

  </div>

  <span 
    v-if="item.badge != null && item.badge !== 0"
    class="badge">
    {{ item.badge }}
  </span>

</div>

<div
  v-else-if="item.type === 'actionBar'"
  :id="item.id"
  class="menu-item gapped nowrap">
  <div
    class="flex">

    <BaseIcon
      class="menu-item-icon"
      :name="item.icon"
      element="span"
      package="tgico" />

    <span class="menu-item-text">
      {{ item.value }}
    </span>

  </div>

  <ToggleSwitch
    id="theme-checkbox"
    v-model="themeChange" />

</div>

<div
  v-else-if="item.type === 'footer'"
  class="flex-column flex-center">
  <a class="context-menu-footer" :href="item.href" target="_blank" rel="noopener noreferrer">
    {{ item.value }}
  </a>
</div>
</template>

<style scoped>
.menu-item {
  padding: 15px;
  border-bottom: 1px solid #444;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  width: 100%;
}

.menu-item,
.reaction-selector {
  height: var(--menu-item-height);
}

.menu-item * {
  pointer-events: none;
  user-select: none;
}

.menu-item.pointer:hover {
  opacity: 0.5;
}

.menu-item-icon {
  width: 1.4rem;
}

.menu-item#leave_room,
.menu-item#kick_from_room,
.menu-item#logout,
.sidebar-row-container-section #button_delete_room {
  color: var(--red);
}

.menu-item.gapped {
  gap: 0.4rem;
}

.context-menu-footer {
  font-size: 0.8rem;
  width: 100%;
  text-align: center;
  text-decoration: none;
  color: var(--input-color);
}
</style>
