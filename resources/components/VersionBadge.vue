<template>
  <span class="version-badge">
    <slot />
  </span>
</template>

<script setup>
// No props needed
</script>

<style>
.version-badge {
  text-transform: uppercase;
  font-size: 9px;
  color: #a8a8a8;
  font-weight: 500;
  letter-spacing: 0.8px;
  line-height: 1.3rem;
  padding-bottom: 3px;
  cursor: none;
  -webkit-user-select: none;
}
</style>
