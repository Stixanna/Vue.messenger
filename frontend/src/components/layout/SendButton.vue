<script setup>
import BaseIcon from '../BaseIcon.vue';


const emit = defineEmits([
  'click',
  'contextmenu',
]);

function handleClick() {
  console.log('send_message');
  emit('click');
}
</script>

<template>
<div
  @click="handleClick"
  class="send-button-container">
  <div
    id="send-button"
    class="send-button btn-container">
    <BaseIcon
      class="inner"
      name="send"
      element="button"
      package="tgico" />
  </div>
</div>
</template>
