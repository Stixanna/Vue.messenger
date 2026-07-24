<script setup>
import BaseIcon from '../BaseIcon.vue';

// import { openSidebar } from '@/services/sidebar';

const emit = defineEmits([
  'click',
]);

function handleClick() {
  console.log('open_sheduled_messages');
  emit('click');
}
</script>

<template>
<div
  id="open_sheduled_messages"
  class="shedule-icon"
  type="button"
  @click="handleClick">
  <BaseIcon
    class="btn-icon"
    element="button"
    name="shedule" />
</div>
</template>
