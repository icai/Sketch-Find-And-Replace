<template>
  <div class="page" :style="{ background: theme.background, color: theme.color }">
    <slot />
  </div>
</template>

<script setup>
defineProps({ theme: Object })
</script>

<style scoped>
.page {
  padding: 24px;
  min-width: 320px;
  min-height: 200px;
  border-radius: 8px;
}
</style>
