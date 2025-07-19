<template>
  <span class="btn-text" :style="style" @click="$emit('click')">
    <slot />
  </span>
</template>

<script setup>
defineProps({
  style: Object,
  theme: Object
})
</script>

<style scoped>
.btn-text {
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}
</style>
