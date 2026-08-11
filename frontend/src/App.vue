<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useGlobalListeners } from '@/composables/useGlobalListeners';
// import { setTheme, getTheme } from 'vue-router'
// import { requestNotifications } from 'vue-router'

// setTheme(getTheme());
// requestNotifications();

// // Возможно нужно возможно нет надо подумать (composable useViewport())
// updateLayoutForMobile(null, true);
// // Дорендер который был ранее, удалить, заменить компонентами
// renderIndexElements()
// // Следует разнести по компонентам/composable при создании
// addIndexListeners();
useGlobalListeners();
</script>

<template>
  <!-- here need to set up base app wrapper -->

  <RouterView />
</template>

<style scoped>
#app {
  margin: 0;
  padding: 0;
  min-height: 100vh;
}
</style>
