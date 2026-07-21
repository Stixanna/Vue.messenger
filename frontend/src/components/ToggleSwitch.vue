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

  theme: {
    type: Boolean,
    default: false,
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
      :class="{
        'theme-checkbox': theme,
      }"
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