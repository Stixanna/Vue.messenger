<script setup>
import { 
  watch, 
  onBeforeUnmount, 
  computed,
  nextTick,
  ref,
} from 'vue';

import { getDynamicMenuPosition } from '@/utils/getDynamicMenuPosition';
import { useContextMenuStore } from '@/stores/contextMenuStore';
import MenuItem from '@/components/menus/MenuItem.vue';

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },

  /**
   * Внешнее состояние меню.
   * Определяет, должно ли меню быть открыто с точки зрения родительского компонента.
   */
  opened: {
    type: Boolean,
    required: true,
  },

  /**
   * Идентификатор типа меню
   * Нужен для координации нескольких ContextMenu через store.
   */
  menuId: {
    type: String,
    required: true,
  },

  /**
   * Элемент, открывающий меню.
   * Используется для исключения клика по trigger из outside-click.
   */
  triggerElement: {
    type: Object,
    default: null,
  },

  /**
   * Контейнер, относительно которого рассчитывается позиция динамического меню.
   */
  containerElement: {
    type: Object,
    default: null,
  },

  /**
   * Событие, в точке которого должно открыться динамическое меню.
   */
  openEvent: {
    type: MouseEvent,
    default: null,
  },

  /**
   * Специальная корректировка позиции для меню (хардкод) 
   */
  isZeroMenu: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  'select',
  'close',
]);

const contextMenuStore = useContextMenuStore();

const menuElement = ref(null);
const visible = ref(false);
/**
 * Показывает, что меню нужно открыть повторно после завершения
 * leave-анимации.
 */
const pendingOpen = ref(false);
const menuPosition = ref(null);

const menuPositionStyle = computed(() => {
  if (!menuPosition.value) {
    return {};
  }

  return {
    top: `${menuPosition.value.top}px`,
    left: `${menuPosition.value.left}px`,
  };
});

function handleItemClick(item) {
  emit('select', item);
  emit('close');
}

function handleOutsideClick(event) {
  if (event.button !== 0) {
    return;
  }

  if (
    props.triggerElement &&
    props.triggerElement.contains(event.target)
  ) {
    return;
  }

  emit('close');
}

async function updateMenuPosition() {
  await nextTick();

  if (
    !menuElement.value ||
    !props.containerElement ||
    !props.openEvent
  ) {
    return;
  }

  const menuSize = {
    width: menuElement.value.offsetWidth,
    height: menuElement.value.offsetHeight,
  };

  menuPosition.value = getDynamicMenuPosition({
    event: props.openEvent,
    container: props.containerElement,
    menuSize,
    isZeroMenu: props.isZeroMenu,
  });
}

async function showMenu() {
  visible.value = true;
  await updateMenuPosition();
}

function hideMenu() {
  visible.value = false;
}

async function handleAfterLeave() {
  if (!pendingOpen.value) {
    return;
  }

  pendingOpen.value = false;

  await showMenu();
}

/**
 * Новая точка открытия.
 *
 * Если это уже открытое меню — запускаем
 * leave → расчёт новой позиции → enter.
 */
watch(
  () => props.openEvent,
  async (event) => {
    if (!props.opened || !event) {
      return;
    }

    if (visible.value) {
      pendingOpen.value = true;
      hideMenu();

      return;
    }

    await showMenu();
  },
);

/**
 * Управляет жизненным циклом конкретного меню.
 */
watch(
  () => props.opened,
  async (opened) => {
    if (opened) {
      window.addEventListener('click', handleOutsideClick);

      contextMenuStore.openMenu(props.menuId);

      if (!visible.value) {
        await showMenu();
      }

      return;
    }

    window.removeEventListener('click', handleOutsideClick);

    pendingOpen.value = false;
    hideMenu();

    contextMenuStore.closeMenu(props.menuId);
  },
);

/**
 * Когда другое меню становится активным,
 * текущий экземпляр закрывается.
 */
watch(
  () => contextMenuStore.activeMenuId,
  (activeMenuId) => {
    if (
      activeMenuId !== props.menuId &&
      visible.value
    ) {
      pendingOpen.value = false;
      hideMenu();
    }
  },
);

onBeforeUnmount(() => {
  window.removeEventListener('click', handleOutsideClick);

  contextMenuStore.closeMenu(props.menuId);
});
</script>

<template>
<Transition
  name="slide-from-left"
  appear
  @after-leave="handleAfterLeave">
  <div
    v-if="visible"
    ref="menuElement"
    class="context-menu menu"
    :style="menuPositionStyle"
    @click.stop>
    <MenuItem
      v-for="item in items"
      :key="item.id"
      :item="item"
      @click="handleItemClick"
    />
  </div>
</Transition>
</template>

<style scoped>
.context-menu {
  position: absolute;
  z-index: 1000;
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