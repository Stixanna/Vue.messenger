<script setup>
import LeftColumnHeader from '@/components/layout/LeftColumnHeader.vue';
import LeftColumnRowList from '@/components/layout/LeftColumnRowList.vue';

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
  id="column-left"
  data-search-parent-container>
    <LeftColumnHeader 
      :treeView="treeView"
      :showSharedTags="showSharedTags"/>

    <LeftColumnRowList 
      :treeView="treeView"
      :showSharedTags="showSharedTags"/>
</div>
</template>

<style scoped>
#column-left {
  position: relative;
  display: flex;
  flex-direction: column;
  width: var(--sidebar-width);
  max-width: 624px;
  height: 100vh;
  background: var(--secondary-color);
}

</style>
