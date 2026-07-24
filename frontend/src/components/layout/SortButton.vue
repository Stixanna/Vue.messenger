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
    class="btn-container">
    <BaseIcon
      class="btn-icon"
      :name="!orderToBot ? 'sort-to-bot' : 'sort-to-top'"
      element="div"
      package="tgico" />
  </div>
</div>
</template>
