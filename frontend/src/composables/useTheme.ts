import { watch } from 'vue';
import { useSettingsStore } from '@/stores/settingsStore';

export function useTheme(): void {
  const settingsStore = useSettingsStore();

  watch(
    () => settingsStore.theme,
    theme => {
      document.documentElement.classList.toggle(
        'dark',
        theme === 'dark',
      );
    },
    { immediate: true },
  );
}