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
