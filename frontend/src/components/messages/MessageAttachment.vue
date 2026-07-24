<script setup>
import { computed } from 'vue';
import { isImageByMimeType } from '@/utils/isImageByMimeType';
import Image from './Image.vue';
import File from './File.vue';


const props = defineProps({
  attachment: {
    type: Object,
    required: true,
  },

  editable: {
    type: Boolean,
    default: false,
  },
});

const ATTACHMENT_TITLES = {
  picture: 'Просмотреть картинку',
  view_file: 'Просмотреть файл',
  download_file: 'Скачать файл',
};

const isImage = computed(() => {
  return isImageByMimeType(props.attachment);
});

const wrapperTitle = computed(() => {
  if (isImage)
    return `${ATTACHMENT_TITLES.picture}\n${props.attachment.name}`;

  if (props.attachment.view)
    return `${ATTACHMENT_TITLES.view_file}\n${props.attachment.name}`;

  return `${ATTACHMENT_TITLES.download_file}\n${props.attachment.name}`;
  // }
});

const emit = defineEmits([
  'click',
]);

function handleClick() {
  console.log('click_attachment_wrapper');
  emit('click');
}
</script>

<template>
<div
  id="attachment-item"
  class="attachment-item"
  :class="{
    image: isImage,
    file: !isImage,
  }"
  :data-id="attachment.id"
  :title="wrapperTitle"
  @click="handleClick">
  
  <Image
    v-if="isImage"
    :attachment="attachment" />

  <File
    v-else
    :attachment="attachment" />

</div>
</template>
