<template>
  <div class="page">
    <slot />
  </div>
</template>

<script setup>
// 已移除 theme 参数，统一用 CSS 变量
</script>

<style>
.page {
  overflow: hidden;
  height: 218px;
  padding: 14px 16px;
  box-sizing: border-box;
  background: var(--background);
  color: var(--text);
}
</style>
