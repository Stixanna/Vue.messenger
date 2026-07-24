<script setup>
import BaseIcon from '../BaseIcon.vue';

const emit = defineEmits([
  'click',
]);

function handleClick() {
  console.log('select_user_to_call_click');
  emit('click');
}
</script>

<template>
<div
  class="btn-container-wrapper btn-container">
  <BaseIcon
    id="select_user_to_call"
    class="btn-icon"
    name="call"
    element="div"
    package="tgico"
    @click="handleClick" />
</div>
</template>
