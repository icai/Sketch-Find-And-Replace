<template>
  <div
    class="btn-inage"
    :style="{
      opacity: isActive
        ? 'var(--active-icon-opacity, 1.0)'
        : 'var(--inactive-icon-opacity, 0.2)'
    }"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  isActive: Boolean
})
// 已移除 theme 参数，统一用 CSS 变量
</script>

<style scoped>
.btn-inage {
  width: 38px;
  height: 32px;
  border-radius: 4px;
  margin-left: 6px;
  cursor: default;
  -webkit-user-select: none;
  user-select: none;
}
</style>
