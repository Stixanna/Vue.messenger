<script setup>
import { ref, watchEffect, computed } from 'vue';
import { loadFetchFile } from '@/services/dataLoaders/loadFetchFile';
import { calcImageWidthSize } from '@/utils/calcImageWidthSize';


const props = defineProps({
  attachment: {
    type: Object,
    required: true,
  },
});

const imageUrl = ref(null);
const isImageLoaded = ref(false);
const isBlobLoading = ref(false);

watchEffect(async (onCleanup) => {
  isImageLoaded.value = false;
  isBlobLoading.value = true;

  if (!props.attachment.blob) {
    props.attachment.blob = await loadFetchFile(
      props.attachment.id,
      false,
      true,
      250,
    );
  }

  const url = URL.createObjectURL(props.attachment.blob);

  imageUrl.value = url;
  isBlobLoading.value = false;

  onCleanup(() => {
    URL.revokeObjectURL(url);
  });
});

const thumbStyle = computed(() => {
  const { width, height } = calcImageWidthSize(
    props.attachment.width,
    props.attachment.height,
  );

  return {
    width: `${width}px`,
    height: `${height}px`,
  };
});
</script>

<template>
  <div
    v-if="!isImageLoaded"
    class="attachment-placeholder"
    :style="thumbStyle"
  >
    Загрузка...
  </div>

  <img
    v-show="!isBlobLoading"
    class="attachment-thumb"
    :src="imageUrl"
    alt=""
    @load="isImageLoaded = true"
  >
</template>


<style>
 
.attachment-item.image {
  width: fit-content;
  height: fit-content;
}

.attachment-placeholder,
.attachment-thumb {
  min-height: 100px;
  min-width: 100px;
  border-radius: 8px;
}

.attachment-placeholder {
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(255,255,255,.1);
}
</style>