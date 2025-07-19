<template>
  <div
    class="help-page"
    :style="{
      position: 'absolute',
      top: isActive ? '0' : '240px',
      width: '100%',
      overflow: 'scroll',
      height: '218px',
      padding: '14px 16px 16px 16px',
      background: theme?.background,
      color: theme?.text,
      zIndex: 100,
      transition: 'top 0.15s ease-in-out',
      marginBottom: '32px',
      boxSizing: 'border-box',
      MozBoxSizing: 'border-box',
      WebkitBoxSizing: 'border-box',
      fontSize: 'small'
    }"
  >
    <label class="top-label" @click="close" :style="{ color: '#a8a8a8' }">× Help</label>
    <h2>Sketch Find and Replace <small>{{ version }}</small></h2>
    <p>By <a href="mailto:hello@anotherplanet.io">Thierry Charbonnel</a> - UX / UI and Code Designer </p>
    <p>New Shortcut : "cmd option shift f"</p>
    <h3>Options to find</h3>
    <div class="help-icons-container">
      <div class="help-icon"><RegexIcon :theme="theme" :isActive="true"/></div>
      <div class="help-icon-description">Regex (Regular expressions)*</div>
    </div>
    <div class="help-icons-container">
      <div class="help-icon"><CaseSensitiveIcon :theme="theme" :isActive="true"/></div>
      <div class="help-icon-description">Case Sensitive (on)/ Case Insensitive (off)</div>
    </div>
    <div class="help-icons-container">
      <div class="help-icon"><WholeWordIcon :theme="theme" :isActive="true"/></div>
      <div class="help-icon-description">Whole Word</div>
    </div>
    <p>* Tips: Turn Regex off if you don't know what Regex is.</p>
    <h3>Replace context</h3>
    <div class="help-icons-container">
      <div class="help-icon"><SelectionIcon :theme="theme" :isActive="true"/></div>
      <div class="help-icon-description">Selection (visible if a selection is active)</div>
    </div>
    <div class="help-icons-container">
      <div class="help-icon"><PageIcon :theme="theme" :isActive="true"/></div>
      <div class="help-icon-description">Current page</div>
    </div>
    <div class="help-icons-container">
      <div class="help-icon"><DocumentIcon :theme="theme" :isActive="true"/></div>
      <div class="help-icon-description">All pages of a document</div>
    </div>
    <p>By default Find and Replace don’t replace string of symbols master except if you are in selection mode or on the “Symbols” named page.</p>
    <h3>Know limitation</h3>
    <p>Backslash not allowed in the replace input.</p>
    <p>Exit the text editon mode before to replace string</p>
    <h3>Regex (Regular expressions)</h3>
    <p>Get the Regex Power! <span style="font-family: emoji">⚡️</span></p>
    <p>Regular expressions are patterns used to match character combinations in strings.</p>
    <p><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions">MDN Regular Expressions Guide</a></p>
    <p><a href="https://javascript.info/regular-expressions">Javascript.info Regular Expressions Guide</a></p>
    <h4>Some Examples</h4>
    <p>The power of search and replace with regex.</p>
    <p>Let's use the search and replace example from above:</p>
    <h4>Convert "John Smith" to "Smith John"</h4>
    <p>Find</p>
    <pre>(\w+)\s+(\w+)</pre>
    <p>Replace with</p>
    <pre>$2 $1</pre>
    <p>Result: Smith John.</p>
    <h4>Replace all double spaces</h4>
    <p>Find</p>
    <pre>\s{2,}</pre>
    <p>Replace with</p>
    <pre>(one space)</pre>
    <h3>Preference Settings</h3>
    <p>Your last search and mode (dark/light) are saved.</p>
    <div class="btn-help-container">
      <Button @click="resetPref" :theme="theme" :isActive="true">
        Reset Preference Settings
      </Button>
    </div>
    <p>and more...</p>
    <h3>Say Hello</h3>
    <p>I’m always happy to be involved into interesting projects.</p>
    <p><a href="https://github.com/icai?ref=sketch">Github: @icai</a></p>
    <div class="btn-help-container">
      <Button @click="close" :theme="theme" primary :isActive="true">
        Close Help
      </Button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Button from './Button.vue'
import RegexIcon from './svg-icons/RegexIcon.vue'
import CaseSensitiveIcon from './svg-icons/CaseSensitiveIcon.vue'
import WholeWordIcon from './svg-icons/WholeWordIcon.vue'
import SelectionIcon from './svg-icons/SelectionIcon.vue'
import PageIcon from './svg-icons/PageIcon.vue'
import DocumentIcon from './svg-icons/DocumentIcon.vue'
import pack from '../../package.json'

defineProps({
  isActive: Boolean,
  theme: Object,
  close: Function,
  resetPref: Function
})
const version = computed(() => pack.version)
</script>

<style scoped>
.top-label {
  text-transform: uppercase;
  font-size: 13px;
  color: #a8a8a8;
  font-weight: 500;
  letter-spacing: 0.8px;
  line-height: 1.3rem;
  padding-bottom: 3px;
  -webkit-user-select: none;
}
.help-icons-container {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
}
.help-icon {
  margin-right: 1em;
}
.btn-help-container {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: stretch;
  margin-top: 2em;
}
</style>