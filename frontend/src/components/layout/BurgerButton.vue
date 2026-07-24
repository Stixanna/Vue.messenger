<script setup>
import BaseIcon from '../BaseIcon.vue';

// import { openSidebar } from '@/services/sidebar';

const emit = defineEmits([
  'click',
]);

function handleClick() {
  console.log('open_main_menu');
  emit('click');
}
</script>

<template>
<div
  @click="handleClick"
  id="menu_btn"
  class="btn-container">
  <BaseIcon
    class="btn-icon"
    name="burger"
    element="button"
    package="tgico" />
</div>
</template>
