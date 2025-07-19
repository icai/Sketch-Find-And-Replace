<script setup>
defineProps({ theme: Object })
</script>

<style>
:root {
  --bg-color: v-bind('theme.background');
  --text-color: v-bind('theme.color');
  --btn-bg: #e0e0e0;
  --btn-text: #333;
  --primary-btn-bg: #007bff;
  --primary-btn-text: #fff;
  --active-opacity: 1;
  --inactive-opacity: 0.5;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', 'Helvetica', 'Arial', sans-serif;
  background: var(--bg-color);
  color: var(--text-color);
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

a, a:active, a:visited {
  color: #0079FF;
}

@font-face {
  font-family: emoji;
  src: local('Apple Color Emoji');
  unicode-range: U+1F300-1F5FF, U+1F600-1F64F, U+1F680-1F6FF, U+2600-26FF;
}
</style>
