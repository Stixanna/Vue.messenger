<script setup>
import BubbleGroup from '@/components/messages/BubbleGroup.vue';


defineProps({
  group: {
    type: Object,
    required: true,
  },
});
</script>

<template>
<div
  class="message-date-group">

  <div
    class="sticky-date">
    <span>
      {{ group.readableDate }}
    </span>
  </div>

  <BubbleGroup
    v-for="(bubble, index) in group.groups"
    :key="index"
    :group="bubble" />

</div>
</template>

<style scoped>

.message-list .sticky-date {
  --middle-header-panes-height: 0px;
  margin-top: 1rem;
  margin-bottom: 1rem;
  pointer-events: none;
  opacity: 1;
  transition: opacity .3s ease;
  z-index: 1;
}

.message-list .sticky-date {
  position: sticky;
  top: calc(.625rem);
}

</style>
