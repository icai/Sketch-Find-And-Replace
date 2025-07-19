<script setup lang="ts">
import { computed } from 'vue'
import Button from './Button.vue'
import LoadingIcon from './svg-icons/LoadingIcon.vue'

const props = defineProps<{
  resetPref: () => void
  isActive: boolean
  theme: {
    background: string
    text: string
    activeIconColor: string
  }
}>()


const topValue = computed(() => (props.isActive ? 0 : 240) + 'px')
</script>

<template>
  <div
    class="loading-page"
    :style="{ top: topValue, backgroundColor: theme.background, color: theme.text }"
  >
    <div class="loading-container">
      <LoadingIcon :color="theme.activeIconColor" />
    </div>
    <div class="btn-container">
      <Button :theme="theme" :isActive="true" @click="resetPref">Reset Preference Settings</Button>
    </div>
    <div class="msg">Sketch Find and Replace</div>
  </div>
</template>

<style scoped>
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
