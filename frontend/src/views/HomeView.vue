<script setup>
import ColumnLeft from '@/components/layout/ColumnLeft.vue';
import ColumnCenter from '@/components/layout/ColumnCenter.vue';
import ColumnRight from '@/components/layout/ColumnRight.vue';
</script>

<template>
  <div id="Main" class="app-container">
    <ColumnLeft />
    <ColumnCenter />
    <ColumnRight />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  width: 100%;
}
</style>
