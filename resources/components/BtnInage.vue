<template>
  <div
    class="btn-inage"
    :class="{ active: isActive }"
    @click="$emit('click')"
    :style="style"
  >
    <slot />
  </div>
</template>

<script setup>
defineProps({
  isActive: Boolean,
  style: Object,
  theme: Object
})
</script>

<style scoped>
.btn-inage {
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
}
.btn-inage.active {
  background: #e0e0e0;
}
</style>
