<script setup>

const props = defineProps({
  tag: {
    type: Object,
    required: true,
  },
});

</script>

<template>
  <span
    class="badge tag"
    :data-value="tag.name">

    {{ tag.name }}

  </span>
</template>

<style scoped>
.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}
/* #menu_btn .badge,  */
.notify-red.badge {
  --opacity: 1;
  background-color: var(--notify-badge-color);
  pointer-events: none;
}
</style>