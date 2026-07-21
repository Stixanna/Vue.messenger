<script setup>
// import BaseIcon from '@/components/BaseIcon.vue';

const props = defineProps({
  tag: {
    type: Object,
    required: true,
  },
});

// const emit = defineEmits([
//   'delete',
// ]);
</script>

<template>
  <span
    class="badge tag"
    :data-value="tag.name">

    {{ tag.name }}

    <!-- <BaseIcon
      v-if="tag.del_btn"
      id="deleteTag"
      name="close"
      @click.stop="emit('delete', tag)" /> -->

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