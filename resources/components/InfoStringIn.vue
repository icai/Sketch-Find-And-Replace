<template>
  <span class="info-string-in" :style="style">
    <slot />
  </span>
</template>

<script setup>
defineProps({ style: Object, theme: Object })
</script>

<style scoped>
.info-string-in {
  font-size: 12px;
  color: #999;
  display: inline-block;
}
</style>
