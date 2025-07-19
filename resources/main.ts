import { createApp } from 'vue'
import App from './components/App.vue'


// Prevent libraries from crashing if they try to access Node globals
if (typeof module === 'undefined') {
// eslint-disable-next-line no-undef
var module = {};
}

if (typeof exports === 'undefined') {
// eslint-disable-next-line no-undef
var exports = {};
}
if (typeof window === 'undefined') {
// eslint-disable-next-line no-undef
var window = {};
}

window.settings = {}

window.updateData = function(json: string) {
  if (typeof window.SetSettings === 'function') {
    window.SetSettings(json)
  } else {
    setTimeout(() => window.updateData(json), 100)
  }
}

const app = createApp(App)
app.mount('#root')
