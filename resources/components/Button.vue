<!-- Button.vue -->
<template>
  <button
    class="base-button"
    :class="{ primary, active: isActive }"
    v-bind="$attrs"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps({
  primary: Boolean,
  isActive: Boolean,
  style: Object
})
</script>

<style>
.base-button {
  flex-grow: 1;
  border: 0;
  box-shadow: none;
  padding: 6px 8px;
  border-radius: 2px;
  font-size: 15px;
  letter-spacing: 0;
  transition: opacity 0.15s ease-in-out;
  background-color: var(--btn-bg);
  color: var(--btn-text);
  opacity: var(--inactive-opacity);
}

/* Primary style */
.base-button.primary {
  background-color: var(--primary-btn-bg);
  color: var(--primary-btn-text);
}

/* Active style */
.base-button.active {
  opacity: var(--active-opacity);
}
</style>
