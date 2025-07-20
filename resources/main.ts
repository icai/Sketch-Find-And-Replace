import { createApp } from 'vue'
import App from './components/App.vue'


window.settings = {}

window.updateData = function(json: string) {
  if (typeof window.SetSettings === 'function') {
    window.SetSettings(json)
  } else {
    setTimeout(() => window.updateData(json), 100)
  }
}

const initApp = () => {
  const app = createApp(App)
  app.mount('#root')
}

setTimeout(() => {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initApp()
  } else {
    document.addEventListener('DOMContentLoaded', initApp)
  }
}, 0)
