<script setup>
import { computed } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },

  element: {
    type: String,
    default: 'div',
  },

  package: {
    type: String,
    default: 'tgico',
  },
});

const iconClasses = computed(() => [
  // 'rp',
  // 'btn-icon',
  props.package,
  `icon-${props.name}`,
]);
</script>

<template>
  <component
    :is="element"
    :class="iconClasses" />
</template>