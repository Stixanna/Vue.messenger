<script setup>
import { computed } from 'vue';
import { formatFileSize } from '@/utils/formatFileSize';
import { splitFilenameByMime } from '@/utils/splitFilenameByMime';
import BaseIcon from '@/components/BaseIcon.vue';

// import { loadFetchFile } from '@/services/dataLoaders/loadFetchFile';


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

const TITLES = {
  change_name: 'Изменить название',
  confirm_edit: 'Подтвердить редактирование',
  edit_file: 'Изменить файл',
  download_file: 'Скачать файл',
}

const fileName = computed(() => {
  return splitFilenameByMime(
    props.attachment.name,
    props.attachment.type,
  );
});

const emit = defineEmits([
  'click',
]);

function handleButtonClick() {
  console.log('click_attachment_button');
  emit('click');
}
</script>

<template>
<div
  class="attachment-info">
  <BaseIcon
    class="file-icon"
    name="file" />

  <div
    class="file-info">
    <div
      id="input_filename_edit"
      class="row-wrapper flex active-input editable-input disabled"
      :data-id="attachment.id"
      :data-value="attachment.name"
      :data-editable-value-path="fileName.base"
      :data-extension="fileName.extension">
      <div
        class="input-wrapper">
        <div
          class="btn-container-wrapper">
          <div
            id="edit-button"
            class="icon-row-button edit-button"
            :title="TITLES.change_name"
            @click.stop="handleButtonClick">
            <BaseIcon
              class="inner"
              name="edit" />

          </div>

          <div
            id="accept-button"
            class="icon-row-button accept-button"
            :title="TITLES.confirm_edit"
            @click.stop="handleButtonClick">
            <BaseIcon
              class="inner"
              name="accept" />
          </div>
        </div>

        <input class="input-field-input" type="text" autocomplete="off" placeholder="Имя файла" maxlength="255" readonly :value="attachment.name">
      </div>
    </div>

    <div
      class="file-subtitle">
      <span v-if="attachment.size" id="file_size">
        {{ formatFileSize(attachment.size) }}
      </span>
    </div>
  </div>
</div>

<div
  class="flex-row-start smallgap">
  <BaseIcon
    class="file-button"
    name="edit"
    :title="TITLES.edit_file"
    @click.stop="handleButtonClick" />
  <BaseIcon
    class="file-button"
    name="download"
    :title="TITLES.download_file"
    @click.stop="handleButtonClick" />
</div>
</template>
