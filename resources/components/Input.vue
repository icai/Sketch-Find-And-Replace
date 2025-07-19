<template>
  <input
    class="input"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    v-bind="$attrs"
    ref="inputRef"
  />
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  modelValue: String,
  theme: Object
})
const inputRef = ref(null)
watch(() => props.modelValue, val => {
  if (inputRef.value && inputRef.value.value !== val) {
    inputRef.value.value = val
  }
})

defineExpose({
  focus: () => {
    if (inputRef.value) inputRef.value.focus()
  },
  inputRef
})
</script>

<style scoped>
.input {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 15px;
  outline: none;
  margin-right: 8px;
}
</style>
