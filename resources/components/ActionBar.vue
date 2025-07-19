<template>
  <div class="action-bar">
    <slot />
  </div>
</template>

<script setup>
// No script needed
</script>

<style scoped>
.action-bar {
  position: absolute;
  top: 15px;
  right: 16px;
  margin-bottom: 8px;
  z-index: 1000;
}
</style>
