<template>
  <label class="input-label" :style="style">
    <slot />
  </label>
</template>

<script setup>
defineProps({ style: Object, theme: Object })
</script>

<style scoped>
.input-label {
  font-size: 13px;
  color: #888;
  margin-right: 8px;
}
</style>
