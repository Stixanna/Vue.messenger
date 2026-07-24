<script setup>
import { computed } from 'vue';

import { useSettingsStore } from '@/stores/settingsStore';
import { getTextColor, } from '@/utils/getTextColor';
import { renderAvatarInitials } from '@/utils/renderAvatarInitials';


const props = defineProps({
  text: {
    type: String,
    required: true,
  },

  colorSource: {
    type: String,
    default: '',
  },
});

const settingsStore = useSettingsStore();

const initials = computed(() =>
  renderAvatarInitials(
    props.text,
    settingsStore.avatarCharsCount === 1,
  ),
);

const avatarStyle = computed(() => {
  if (!props.colorSource) {
    return {};
  }
  console.log(props.colorSource)

  const avatarColor = getTextColor(props.colorSource);

  return {
    backgroundImage: `linear-gradient(var(--white) -300%, ${avatarColor})`,
  };
});
</script>

<template>
  <div class="avatar-wrapper">
    <div
      class="avatar no-photo"
      :style="avatarStyle">

      <div
        class="inner"
        :text="text">

        {{ initials }}
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>