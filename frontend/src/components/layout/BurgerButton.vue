<script setup>
import BaseIcon from '../BaseIcon.vue';

const emit = defineEmits([
  'click',
]);

function handleClick() {
  emit('click');
}
</script>

<template>
<div
  @click="handleClick"
  id="menu_btn"
  class="btn-container btn-icon">
  <BaseIcon
    class=""
    name="burger"
    element="div"
    package="tgico" />
</div>
</template>
