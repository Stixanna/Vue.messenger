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
  class="btn-container-wrapper btn-container btn-icon">
  <BaseIcon
    id="select_user_to_call"
    class=""
    name="call"
    element="div"
    package="tgico"
    @click="handleClick" />
</div>
</template>
