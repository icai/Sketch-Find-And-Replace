<template>
  <span class="btn-text"><slot /></span>
</template>

<script setup>
// 已移除 theme 参数，统一用 CSS 变量
</script>

<style>
.btn-text {
  text-transform: uppercase;
  opacity: 0.33;
  font-size: 13px;
  line-height: 1.3rem;
  font-weight: 500;
  color: var(--btn-text, #333);
  letter-spacing: 0.8px;
  padding-left: 4px;
  padding-right: 4px;
  padding-bottom: 3px;
  cursor: default;
  -webkit-user-select: none;
  user-select: none;
}
</style>
