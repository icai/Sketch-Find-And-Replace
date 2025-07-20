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
import { ref } from 'vue'
const inputRef = ref(null)
defineExpose({
  focus: () => {
    if (inputRef.value) inputRef.value.focus()
  }
})
</script>

<style>
.input {
  width: 63%;
  height: calc(2rem - 2px);
  font-size: 15px;
  padding: 0 8px;
  font-weight: 400;
  line-height: 1.1rem;
  letter-spacing: 0.92px;
  color: var(--input-text, #000);
  background-color: var(--input-background, #FAFAFA);
  background-clip: padding-box;
  border: 1px solid var(--stroke, #B6B6B6);
  border-radius: 2px;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  outline: none;
  margin-right: 8px;
}
</style>
