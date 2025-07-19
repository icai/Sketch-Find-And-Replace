<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { getTheme } from './Colors'
import Help from './Help.vue'
import Loading from './Loading.vue'
import GlobalStyle from './GlobalStyle.vue'
import Page from './Page.vue'
import Row from './Row.vue'
import RowGroup from './RowGroup.vue'
import InfoRowGroup from './InfoRowGroup.vue'
import BtnGroup from './BtnGroup.vue'
import Button from './Button.vue'
import BtnText from './BtnText.vue'
import BtnInage from './BtnInage.vue'
import Input from './Input.vue'
import ActionBar from './ActionBar.vue'
import InputLabel from './InputLabel.vue'
import InfoString from './InfoString.vue'
import InfoStringIn from './InfoStringIn.vue'
import RegexIcon from './svg-icons/RegexIcon.vue'
import CaseSensitiveIcon from './svg-icons/CaseSensitiveIcon.vue'
import WholeWordIcon from './svg-icons/WholeWordIcon.vue'
import SelectionIcon from './svg-icons/SelectionIcon.vue'
import PageIcon from './svg-icons/PageIcon.vue'
import DocumentIcon from './svg-icons/DocumentIcon.vue'

const darkMode = ref(false)
const regexActive = ref(false)
const caseSensitive = ref(false)
const wholeWord = ref(true)
const findMode = ref(2)
const findString = ref('')
const replaceString = ref('')
const selection = ref(false)
const replaceStart = ref(false)
const helpActive = ref(false)
const mounted = ref(false)
const findInputRef = ref(null)
const replaceInputRef = ref(null)

const theme = computed(() => getTheme(darkMode.value))

onMounted(() => {
  window.SetSettings = json => {
    const state = JSON.parse(json)
    darkMode.value = state.darkMode
    regexActive.value = state.regexActive
    caseSensitive.value = state.caseSensitive
    wholeWord.value = state.wholeWord
    findMode.value = state.findMode
    findString.value = state.findString
    replaceString.value = state.replaceString
    selection.value = state.selection
    replaceStart.value = state.replaceStart
    helpActive.value = state.helpActive
    mounted.value = true
    nextTick(() => {
      findInputRef.value && findInputRef.value.focus()
    })
  }
  setTimeout(() => {
    findInputRef.value && findInputRef.value.focus()
    mounted.value = true
  }, 5000)
  document.body.style.margin = 0
  document.body.style.padding = 0
})

function changeMode() {
  darkMode.value = !darkMode.value
  window.postMessage('setDarkMode', darkMode.value)
}
function handleRegex() {
  regexActive.value = !regexActive.value
  window.postMessage('find', JSON.stringify({
    darkMode: darkMode.value,
    regexActive: regexActive.value,
    caseSensitive: caseSensitive.value,
    wholeWord: wholeWord.value,
    findMode: findMode.value,
    findString: findString.value,
    replaceString: replaceString.value,
    selection: selection.value,
    replaceStart: replaceStart.value,
    helpActive: helpActive.value,
    mounted: mounted.value
  }))
}
function handleCaseSensitive() {
  caseSensitive.value = !caseSensitive.value
  window.postMessage('find', JSON.stringify({
    darkMode: darkMode.value,
    regexActive: regexActive.value,
    caseSensitive: caseSensitive.value,
    wholeWord: wholeWord.value,
    findMode: findMode.value,
    findString: findString.value,
    replaceString: replaceString.value,
    selection: selection.value,
    replaceStart: replaceStart.value,
    helpActive: helpActive.value,
    mounted: mounted.value
  }))
}
function handleWholeWord() {
  wholeWord.value = !wholeWord.value
  window.postMessage('find', JSON.stringify({
    darkMode: darkMode.value,
    regexActive: regexActive.value,
    caseSensitive: caseSensitive.value,
    wholeWord: wholeWord.value,
    findMode: findMode.value,
    findString: findString.value,
    replaceString: replaceString.value,
    selection: selection.value,
    replaceStart: replaceStart.value,
    helpActive: helpActive.value,
    mounted: mounted.value
  }))
}
function handleSelection() {
  if (!selection.value) return
  findMode.value = 1
  window.postMessage('find', JSON.stringify({
    darkMode: darkMode.value,
    regexActive: regexActive.value,
    caseSensitive: caseSensitive.value,
    wholeWord: wholeWord.value,
    findMode: 1,
    findString: findString.value,
    replaceString: replaceString.value,
    selection: selection.value,
    replaceStart: replaceStart.value,
    helpActive: helpActive.value,
    mounted: mounted.value
  }))
}
function handlePage() {
  findMode.value = 2
  window.postMessage('find', JSON.stringify({
    darkMode: darkMode.value,
    regexActive: regexActive.value,
    caseSensitive: caseSensitive.value,
    wholeWord: wholeWord.value,
    findMode: 2,
    findString: findString.value,
    replaceString: replaceString.value,
    selection: selection.value,
    replaceStart: replaceStart.value,
    helpActive: helpActive.value,
    mounted: mounted.value
  }))
}
function handleDocument() {
  findMode.value = 3
  window.postMessage('find', JSON.stringify({
    darkMode: darkMode.value,
    regexActive: regexActive.value,
    caseSensitive: caseSensitive.value,
    wholeWord: wholeWord.value,
    findMode: 3,
    findString: findString.value,
    replaceString: replaceString.value,
    selection: selection.value,
    replaceStart: replaceStart.value,
    helpActive: helpActive.value,
    mounted: mounted.value
  }))
}
function findInputHandleKeyPress(event) {
  if (event.key === 'Enter' && replaceInputRef.value) {
    replaceInputRef.value.focus()
  }
}
function findInputHandleOnChange(event) {
  findString.value = event.target.value
  replaceString.value = replaceInputRef.value ? replaceInputRef.value.value.split('\\').join('') : ''
}
function replaceInputHandleKeyPress(event) {
  if (event.key === 'Enter') {
    replaceFn()
  }
}
function replaceInputHandleOnChange(event) {
  findString.value = findInputRef.value ? findInputRef.value.value : ''
  replaceString.value = event.target.value.split('\\').join('')
}
function closeWindow() {
  window.postMessage('close')
}
function resetPref() {
  window.postMessage('resetPref')
  findInputRef.value && findInputRef.value.focus()
  mounted.value = true
}
function toogleHelp() {
  helpActive.value = !helpActive.value
}
function replaceFn() {
  replaceStart.value = true
  window.postMessage('replace', JSON.stringify({
    darkMode: darkMode.value,
    regexActive: regexActive.value,
    caseSensitive: caseSensitive.value,
    wholeWord: wholeWord.value,
    findMode: findMode.value,
    findString: findString.value,
    replaceString: replaceString.value,
    selection: selection.value,
    replaceStart: true,
    helpActive: helpActive.value,
    mounted: mounted.value
  }))
}
</script>

<template>
  <ActionBar>
    <BtnGroup>
      <BtnText :style="{ cursor: 'pointer' }" :theme="theme" @click="changeMode">
        {{ darkMode ? 'Light Mode' : 'Dark Mode' }}
      </BtnText>
      <BtnText :theme="theme" :style="{ cursor: 'help' }" @click="toogleHelp">?</BtnText>
    </BtnGroup>
  </ActionBar>
  <Page :theme="theme">
    <RowGroup>
      <Row>
        <InputLabel :theme="theme">FIND</InputLabel>
      </Row>
      <Row>
        <Input
          :theme="theme"
          :value="findString"
          @keypress="findInputHandleKeyPress"
          @input="findInputHandleOnChange"
          ref="findInputRef"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
        />
        <BtnGroup>
          <BtnInage @click="handleRegex" :theme="theme" :isActive="regexActive">
            <RegexIcon :theme="theme" :isActive="regexActive" />
          </BtnInage>
          <BtnInage @click="handleCaseSensitive" :theme="theme" :isActive="caseSensitive">
            <CaseSensitiveIcon :theme="theme" :isActive="caseSensitive" />
          </BtnInage>
          <BtnInage @click="handleWholeWord" :theme="theme" :isActive="wholeWord">
            <WholeWordIcon :theme="theme" :isActive="wholeWord" />
          </BtnInage>
        </BtnGroup>
      </Row>
    </RowGroup>
    <RowGroup>
      <Row>
        <InputLabel :theme="theme">REPLACE BY</InputLabel>
      </Row>
      <Row>
        <Input
          :theme="theme"
          :value="replaceString"
          @keypress="replaceInputHandleKeyPress"
          @input="replaceInputHandleOnChange"
          ref="replaceInputRef"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
        />
        <BtnGroup>
          <BtnInage v-if="selection" @click="handleSelection" :theme="theme" :isActive="findMode === 1">
            <SelectionIcon :theme="theme" :isActive="findMode === 1" />
          </BtnInage>
          <BtnInage @click="handlePage" :theme="theme" :isActive="findMode === 2">
            <PageIcon :theme="theme" :isActive="findMode === 2" />
          </BtnInage>
          <BtnInage @click="handleDocument" :theme="theme" :isActive="findMode === 3">
            <DocumentIcon :theme="theme" :isActive="findMode === 3" />
          </BtnInage>
        </BtnGroup>
      </Row>
    </RowGroup>
    <InfoRowGroup>
      <InfoString :theme="theme">
        Options:
        <InfoStringIn :theme="theme">
          {{ regexActive ? ' Regex, ' : ' ' }}
          {{ caseSensitive ? 'Case Sensitive, ' : 'Case Insensitive, ' }}
          {{ wholeWord ? 'Whole Word, ' : '' }}
          in the
          <template v-if="findMode === 1"> Selection</template>
          <template v-if="findMode === 2"> Page</template>
          <template v-if="findMode === 3"> Document</template>
        </InfoStringIn>
      </InfoString>
    </InfoRowGroup>
    <RowGroup>
      <Row>
        <Button @click="closeWindow" :theme="theme" :isActive="true">Cancel</Button>
        <Button @click="replaceFn" primary :theme="theme" :isActive="!replaceStart">Replace</Button>
      </Row>
    </RowGroup>
  </Page>
  <Help :isActive="helpActive" :theme="theme" :close="toogleHelp" :resetPref="resetPref" />
  <Loading :isActive="replaceStart || !mounted" :theme="theme" :resetPref="resetPref" />
  <GlobalStyle :theme="theme" />
</template>
