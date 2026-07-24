<script setup>
import BaseIcon from '../BaseIcon.vue';

// import { openSidebar } from '@/services/sidebar';

const emit = defineEmits([
  'click',
]);

function handleClick() {
  console.log('add_attachment');
  emit('click');
}
</script>

<template>
<div
  id="attach-button"
  class="attach-button"
  title="Attach file"
  @click="handleClick">
  <BaseIcon
    class="btn-icon"
    name="skrepka"
    element="button"
    package="tgico" />
</div>
</template>
