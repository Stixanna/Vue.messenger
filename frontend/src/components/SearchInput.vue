<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});

const emit = defineEmits([
  'update:modelValue',
  'search',
  'clear',
]);

const searchValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
    emit('search', value);
  },
});

function clearSearch() {
  emit('update:modelValue', '');
  emit('clear');
}
</script>

<template>
  <div class="input-search">
    <input
      id="searchInput"
      v-model="searchValue"
      class="input-search-input"
      type="text"
      autocomplete="off"
    >

    <span
      class="input-search-part input-search-icon tgico icon-search"
    />

    <span
      v-if="!searchValue"
      class="input-search-placeholder"
    >
      Поиск
    </span>

    <span
      v-if="searchValue"
      class="input-search-part input-search-icon tgico icon-close"
      @click="clearSearch"
    />
  </div>
</template>

<style scoped>

.input-search {
  --padding-inline: 0rem;
  --border-width: 1px;
  --height: 42px;
  --border-radius: 22px;
  --icon-left-offset: calc(.8125rem + var(--padding-inline));
  --icon-size: 1.5rem;
  --padding-horizontal: calc(var(--height) + 3px - var(--border-width) + var(--padding-inline));
  --background-color: var(--base-color);
  position: relative;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.input-search-input {
  --border-width: inherit;
  --padding-horizontal: inherit;
  width: 100%;
  border: var(--border-width) solid var(--input-search-border-color);
  border-radius: var(--border-radius);
  padding: 0px calc(var(--padding-horizontal) - var(--padding-inline));
  height: var(--height);
  min-height: var(--height) !important;
  max-height: var(--height) !important;
  line-height: var(--line-height-16);
  color: var(--text-color);
  background-color: var(--background-color);
}

.input-search-icon {
  width: var(--icon-size);
  height: var(--icon-size);
  pointer-events: none;
  top: calc(var(--icon-size) / 3.25);
}

.input-search-icon.icon-search {
  inset-inline-start: var(--icon-left-offset);
}

.input-search-icon.icon-close {
  inset-inline-end: var(--icon-left-offset);
  pointer-events: all;
  cursor: pointer;
}

.input-search-placeholder {
  position: absolute;
  color: var(--input-color);
  white-space: nowrap;
  inset-inline-start: calc(var(--padding-horizontal) + var(--border-width));
  pointer-events: none;
  transform-origin: left center;
}

.input-search .input-search-part {
  position: absolute;
  top: 0.5rem;
  font-size: var(--icon-size);
  color: var(--text-color);
  opacity: var(--max-opacity);
  line-height: 1;
}
</style>