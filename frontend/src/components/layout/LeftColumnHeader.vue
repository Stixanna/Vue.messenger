<script setup>
import { ref } from 'vue';
import BurgerButton from '@/components/layout/BurgerButton.vue';
import ChatListOptions from '@/components/layout/ChatListOptions.vue';
import SearchInput from '@/components/SearchInput.vue';

const search = ref('');

function handleSearch(value) {
  console.log('search:', value);
}

function clearSearch() {
  console.log('search cleared');
}
const props = defineProps({
  treeView: {
    type: Boolean,
    default: false,
  },

  showSharedTags: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
<div
  class="sidebar-header content-container-wrapper">
  <div
    class="sidebar-header-inner">

    <BurgerButton />

    <SearchInput
      v-model="search"
      @search="handleSearch"
      @clear="clearSearch" />

  </div>

  <ChatListOptions />
</div>
</template>

<style scoped>
.sidebar-header {
  background-color: var(--secondary-color);
  min-height: 3.8rem;
  flex: 0 0 auto;
  cursor: default;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

#column-left>.sidebar-header {
  padding: .25rem 1rem;
}

.sidebar-header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-inline: 1.5rem;
  position: relative;
  width: 100%;
}

#column-left>.sidebar-header>.sidebar-header-inner {
  padding: 0;
  gap: .4375rem;
  margin-bottom: .2rem;
}
</style>
