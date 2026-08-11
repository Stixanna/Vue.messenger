import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const STORAGE_KEY = 'client_settings';

interface Settings {
  avatarCharsCount: number;
  dateFormat: string;
  notificationsAllowed: boolean;
  showSharedTags: boolean;
  showTagsTree: boolean;
  theme: 'light' | 'dark';
  isRoomsResorted: boolean;
}

const defaultSettings = {
  avatarCharsCount: 1,
  dateFormat: 'def',
  notificationsAllowed: true,
  showSharedTags: false,
  showTagsTree: false,
  theme: 'light',
  isRoomsResorted: false,
};

export const useSettingsStore = defineStore(
  'settings',
  () => {

    const settings = ref({
      ...defaultSettings,
      ...loadSettings(),
    });


    function loadSettings() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);

        return saved
          ? JSON.parse(saved)
          : {};
      }
      catch {
        return {};
      }
    }


    function saveSettings() {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(settings.value),
      );
    }


    function updateSetting<K extends keyof Settings>(
      key: K,
      value: Settings[K],
    ): void {
      settings.value[key] = value;
      saveSettings();
    }


    const avatarCharsCount = computed(
      () => settings.value.avatarCharsCount,
    );

    const dateFormat = computed(
      () => settings.value.dateFormat,
    );

    const notificationsAllowed = computed(
      () => settings.value.notificationsAllowed,
    );

    const showSharedTags = computed(
      () => settings.value.showSharedTags,
    );

    const showTagsTree = computed(
      () => settings.value.showTagsTree,
    );

    const theme = computed(
      () => settings.value.theme,
    );

    const isRoomsResorted = computed(
      () => settings.value.isRoomsResorted,
    );


    return {
      settings,

      avatarCharsCount,
      dateFormat,
      notificationsAllowed,
      showSharedTags,
      showTagsTree,
      theme,
      isRoomsResorted,

      updateSetting,
      saveSettings,
    };
  },
);