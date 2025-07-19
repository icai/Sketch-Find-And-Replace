<template>
  <div class="warning">
    <slot />
  </div>
</template>

<script setup>
// No props needed
</script>

<style scoped>
.warning {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
  padding: 8px 12px;
  border-radius: 4px;
  margin: 8px 0;
}
</style>
