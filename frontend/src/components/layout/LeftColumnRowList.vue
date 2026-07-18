<script setup>
const props = defineProps({
  treeView: {
    type: Boolean,
    default: false,
  },

  showSharedTags: {
    type: Boolean,
    default: false,
  },
});

</script>

<template>
<div
  id="row-list"
  class="row-list"
  data-menu-position-container>
  <div
    id="chat-list"
    class="chat-list"
    data-menu-host />

  <div
    id="message-list"
    class="chat-list" />
</div>
</template>

<style scoped>

.row-list {
  height: 100%;
  overflow-y: auto;
  position: relative;
}

#chat-list.chat-list {
  padding-bottom: .5rem;
}

.chat-list {
  --padding-inline: .5rem;
  padding: 0 var(--padding-inline);
}

</style>