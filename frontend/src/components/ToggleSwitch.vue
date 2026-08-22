<script setup>
const props = defineProps({
  id: {
    type: String,
    required: true,
  },

  modelValue: {
    type: Boolean,
    required: true,
  },

  leftText: {
    type: String,
    default: '',
  },

  rightText: {
    type: String,
    default: '',
  },
});


const emit = defineEmits([
  'update:modelValue',
]);


function handleChange(event) {
  emit(
    'update:modelValue',
    event.target.checked,
  );
}
</script>


<template>
<div class="flex">

  <input
    :id="id"
    class="toggle-checkbox"
    type="checkbox"
    :checked="modelValue"
    @change="handleChange" />

  <label
    class="toggle_area"
    :for="id">

    <span class="moon">
      {{ leftText }}
    </span>

    <span class="sun">
      {{ rightText }}
    </span>

    <span class="toggle-ball" />

  </label>

</div>
</template>

<style scoped>
.menu-item .theme-checkbox,
.menu-item .toggle_area {
  pointer-events: auto;
}
.dark #theme-checkbox:checked + .toggle_area {
  background-color: var(--base-color-dark);
}
</style>