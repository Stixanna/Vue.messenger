<script setup>
import BaseIcon from '../BaseIcon.vue';


const emit = defineEmits([
  'click',
]);
const props = defineProps({
  orderToBot: {
    type: Boolean,
    default: false
  }
});

function handleClick() {
  console.log('resortChats');
  emit('click');
}
</script>

<template>
<div
  @click="handleClick"
  id="sort_btn"
  class="absolute-btn 
    abs-bot-right 
    sort-btn">
  <div
    class="btn-container btn-icon">
    <BaseIcon
      class=""
      :name="!orderToBot ? 'sort-to-bot' : 'sort-to-top'"
      element="div"
      package="tgico" />
  </div>
</div>
</template>

<style scoped>
.sort-btn {
  font-size:2rem;
  background-color: var(--background-color);
}
.sort-btn .btn-icon {
  font-size:inherit;
}
</style>
