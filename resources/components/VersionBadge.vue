<template>
  <span class="version-badge">
    <slot />
  </span>
</template>

<script setup>
// No props needed
</script>

<style scoped>
.version-badge {
  background: #eee;
  color: #333;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
}
</style>
