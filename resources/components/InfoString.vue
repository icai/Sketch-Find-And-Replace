<template>
  <span class="info-string" :style="style">
    <slot />
  </span>
</template>

<script setup>
defineProps({ style: Object, theme: Object })
</script>

<style scoped>
.info-string {
  font-size: 13px;
  color: #666;
  display: inline-block;
}
</style>
