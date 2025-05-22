<template>
  <div class="toggle-wrapper">
    <input
      type="checkbox"
      id="theme-toggle"
      class="toggle-input"
      @change="toggleTheme"
      role="switch"
      aria-label="Toggle dark mode"
      :aria-checked="isDark"
    >
    <label for="theme-toggle" class="toggle-label">
      <span aria-hidden="true">🌙</span>
      <span aria-hidden="true">☀️</span>
      <div class="toggle-slider"></div>
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import tinycolor from 'tinycolor2';

type Props = {
  color: string;
}
const props = defineProps<Props>();
const emit = defineEmits(['change']);

const lightColor = tinycolor(props.color).lighten(80);
const darkColor = tinycolor(props.color).lighten(10);

const isDark = ref(false);

const toggleTheme = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark', isDark.value);
  emit('change', isDark.value);
}

</script>

<style scoped>
.toggle-wrapper {
  position: relative;
}
 .toggle-input {
  display: none;
}

.toggle-label {
  width: 40px;
  height: 26px;
  background-color: v-bind(lightColor);
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px;
  cursor: pointer;
  transition: background-color 0.5s ease;
  font-size: 16px;
  color: #fff;
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 22px;
  height: 22px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.5s ease;
}

.toggle-input:checked + .toggle-label {
  background-color: v-bind(darkColor);
}

.toggle-input:checked + .toggle-label .toggle-slider {
  transform: translateX(26px);
}
</style>
