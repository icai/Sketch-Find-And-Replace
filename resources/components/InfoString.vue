<template>
  <span class="info-string">
    <slot />
  </span>
</template>

<script setup>
// 已移除 style prop，统一用 CSS 变量
</script>

<style>
.info-string {
  font-size: 13px;
  color: var(--text-info, #666);
  display: inline-block;
}
</style>
