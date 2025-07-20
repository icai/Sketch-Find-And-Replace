<template>
  <label class="input-label">
    <slot />
  </label>
</template>

<script setup>
</script>

<style>
.input-label {
  text-transform: uppercase;
  font-size: 13px;
  color: #a8a8a8;
  font-weight: 500;
  letter-spacing: 0.8px;
  line-height: 1.3rem;
  padding-bottom: 3px;
  cursor: none;
  user-select: none;
}
</style>
