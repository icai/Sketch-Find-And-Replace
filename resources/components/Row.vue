<template>
  <div class="row">
    <slot />
  </div>
</template>

<script setup>
// No script needed
</script>

<style scoped>
.row {
  display: flex;
  justify-content: space-between;
}
</style>
