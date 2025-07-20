<template>
  <div class="btn-group">
    <slot />
  </div>
</template>

<script setup>
// No script needed for simple wrapper
</script>

<style>
.btn-group {
  display: flex;
  justify-content: space-between;
}
</style>
