<script setup>
import { computed } from 'vue';

import ToggleSwitch from '@/components/ToggleSwitch.vue';
import BaseIcon from '@/components/BaseIcon.vue';

import { useSettingsStore } from '@/stores/settingsStore';


const settingsStore = useSettingsStore();


const showTagsTree = computed({
  get() {
    return settingsStore.showTagsTree;
  },

  set(value) {
    settingsStore.updateSetting(
      'showTagsTree',
      value,
    );
  },
});


const showSharedTags = computed({
  get() {
    return settingsStore.showSharedTags;
  },

  set(value) {
    settingsStore.updateSetting(
      'showSharedTags',
      value,
    );
  },
});
</script>


<template>
  <div class="chat-list-options">

    <div class="chat-list-option">

      <BaseIcon name="funnel"
        element="i"
        package="lucide" 
      />

      <span>
        Вид дерева
      </span>

      <ToggleSwitch
        id="showtagstree-checkbox"
        v-model="showTagsTree" />

    </div>


    <div class="chat-list-option">

      <span>
        Общие теги
      </span>

      <ToggleSwitch
        id="showsharedtags-checkbox"
        v-model="showSharedTags" />

    </div>

  </div>
</template>

<style scoped>

</style>