<script setup>
import { ref, watchEffect } from 'vue';
import { loadFetchFile } from '@/services/dataLoaders/loadFetchFile';


const props = defineProps({
  attachment: {
    type: Object,
    required: true,
  },
});

const imageUrl = ref(null);

watchEffect(async (onCleanup) => {

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

  onCleanup(() => {
    URL.revokeObjectURL(url);
  });
});
</script>

<template>
    <img 
        class="attachment-thumb" 
        :src="imageUrl" 
        alt="">
</template>
