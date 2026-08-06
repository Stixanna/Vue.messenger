<script setup>
import {
  ref,
  computed
} from 'vue';
import {
  useInvitesStore
} from '@/stores/invitesStore';
import {
  menuText
} from '@/constants/menuText';
import BurgerButton from '@/components/layout/BurgerButton.vue';
import ChatListOptions from '@/components/layout/ChatListOptions.vue';
import SearchInput from '@/components/SearchInput.vue';
import ContextMenu from '@/components/menus/ContextMenu.vue';

const search = ref('');
const menuOpened = ref(false);

function handleSearch(value) {
  console.log('search:', value);
}

function clearSearch() {
  console.log('search cleared');
}

function toggleMenu() {
  menuOpened.value = !menuOpened.value;
}

function onItemSelect(item) {
  console.log('clicked: ', item);
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

const url = '';
const invitesStore = useInvitesStore();

const invites_count = computed(() => {
  const count = invitesStore.getInvitesCount();
  return count;
});

const menuItems = computed(() => [{
    id: "createroom",
    value: menuText.main.createRoom,
    icon: 'docplus',
  },
  {
    id: "contacts",
    value: menuText.main.contacts,
    icon: 'peoples',
  },
  {
    id: "invites",
    value: menuText.main.invites,
    icon: 'envelope',
    badge: invites_count
  },
  {
    id: "settings",
    value: menuText.main.settings,
    icon: 'gear',
  },
  {
    id: "theme",
    value: menuText.main.theme,
    icon: 'crescent',
    type: "actionBar"
  },
  {
    id: "",
    value: menuText.main.footer,
    href: url,
    type: "footer"
  },
]);
</script>

<template>
<div
  class="sidebar-header content-container-wrapper">
  <div
    class="sidebar-header-inner">

    <BurgerButton
      @click="toggleMenu" />

    <ContextMenu
      name="slide-from-left"
      :opened="menuOpened"
      :items="menuItems"
      @select="onItemSelect"
      @close="menuOpened = false" />

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
