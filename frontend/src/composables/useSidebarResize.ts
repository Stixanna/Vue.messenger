import type { 
  Ref, 
} from 'vue';
import { onMounted, onBeforeUnmount } from 'vue';
// import { setRootCssVariable } from '@/composables/rootCssVariableStore';


interface SidebarResizeOptions {
  minWidth?: number;
  maxWidth?: number;
  storageKey?: string;
}

export function useSidebarResize(
  sidebar: Ref<HTMLElement | null>,
  options: SidebarResizeOptions = {},
) {
  const {
    minWidth = 324,
    maxWidth = 624,
    storageKey = 'sidebarWidth',
  } = options;

  let startX = 0;
  let currentWidth = 0;

  const handleMouseMove = (event: MouseEvent) => {
    if (!sidebar.value) {
      return;
    }

    const diff = event.clientX - startX;

    const newWidth = Math.max(
      minWidth,
      Math.min(maxWidth, currentWidth + diff),
    );

    const newValue = `${newWidth}px`;

    sidebar.value.style.width = newValue;

    localStorage.setItem(storageKey, newValue);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleResizeStart = (event: MouseEvent) => {
    if (!sidebar.value) {
      return;
    }

    startX = event.clientX;
    currentWidth = sidebar.value.offsetWidth;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  onMounted(() => {
    const savedWidth = localStorage.getItem(storageKey);

    if (!savedWidth || !sidebar.value) {
      return;
    }

    sidebar.value.style.width = savedWidth;
  });

  onBeforeUnmount(() => {
    handleMouseUp();
  });

  return {
    handleResizeStart,
  };
}