<template>
  <div class="warning" :style="{ top: isActive ? '-32px' : '0' }">
    <slot />
  </div>
</template>

<script setup>
defineProps({ isActive: Boolean })
</script>

<style>
.warning {
  position: absolute;
  width: 100%;
  background-color: lime;
  color: var(--textInfo);
  z-index: 100;
  transition: top 0.15s ease-in-out;
}
</style>
