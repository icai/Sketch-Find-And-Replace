<script setup lang="ts">
import { computed } from 'vue'
import Button from './Button.vue'
import LoadingIcon from './svg-icons/LoadingIcon.vue'

const props = defineProps<{
  resetPref: () => void
  isActive: boolean
}>()

const topValue = computed(() => (props.isActive ? 0 : 240) + 'px')
</script>

<template>
  <div
    class="loading-page"
    :style="{ top: topValue, display: isActive ? 'block' : 'none' }"
  >
    <div class="loading-container">
      <LoadingIcon :color="'var(--active-icon-color)'" />
    </div>
    <div class="btn-container">
      <Button :isActive="true" @click="resetPref">Reset Preference Settings</Button>
    </div>
    <div class="msg">Sketch Find and Replace</div>
  </div>
</template>

<style>
.loading-page {
  position: absolute;
  width: 100%;
  overflow: scroll;
  height: 218px;
  padding: 14px 16px 16px 16px;
  z-index: 100;
  transition: top 0.15s ease-in-out;
  margin-bottom: 32px;
  box-sizing: border-box;
  background-color: var(--background);
  color: var(--text);
}

.loading-container {
  height: 140px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
}

.msg {
  text-align: center;
  font-size: 12px;
}

.btn-container {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: stretch;
  margin-top: 0;
}
</style>
