<template>
  <BaseSlider
    class="vc-hue-slider"
    :max="360"
    :step="1"
    :model-value="sliderValue"
    :direction="direction"
    @update:model-value="handleChange"
    aria-label="Hue"
  >
    <template #background><div class="gradient"></div></template>
    <template #picker><slot></slot></template>
  </BaseSlider>
</template>

<script setup lang="ts">
import { watch, computed, ref } from 'vue';
import BaseSlider from './BaseSlider.vue';

// <Hue /> is not allowed to use tinycolor instance
// because it may lost hue value in some cases:
// saturation is 0, lightness is 0 or 100, value is 0

type Props = {
  direction?: 'horizontal' | 'vertical';
  // Avoiding `defineModel` for Vue 2.7 compatibility
  modelValue?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'horizontal',
  modelValue: 0
});

const emit = defineEmits(['update:modelValue']);

const gradientBg = computed(() => {
  return `linear-gradient(to ${props.direction === 'horizontal' ? 'right' : 'top'}, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)`;
});

const hue = computed(() => {
  const value = Number(props.modelValue);
  return Number.isNaN(value) ? 0 : value;
});

const pullDirection = ref<'right' | 'left' | undefined>();

watch(hue, (newHue, oldHue) => {
  if (newHue !== 0 && newHue - oldHue > 0) pullDirection.value = 'right';
  if (newHue !== 0 && newHue - oldHue < 0) pullDirection.value = 'left';
});

const sliderValue = computed(() => {
  if (props.direction === 'vertical') {
    if (hue.value === 0 && pullDirection.value === 'right') {
      return 0;
    }
    return 360 - hue.value;
  }
  if (props.direction === 'horizontal') {
    if (hue.value === 0 && pullDirection.value === 'right') {
      return 360;
    }
    return hue.value;
  }
  return 0;
});

function handleChange (value: number) {
  let newValue = Math.round(value);
  if (props.direction === 'vertical') {
    newValue = Math.round(360 - newValue);
  }
  if (hue.value !== newValue) {
    emitChange(newValue);
  }
}
function emitChange(newHue: number) {
  console.log('=emitChange=>', newHue);
  emit('update:modelValue', newHue);
}
</script>

<style scoped>
.vc-hue-slider {
  cursor: crosshair;
  /** preventing default (scroll) behavior */
  touch-action: none;
}
.gradient {
  width: 100%;
  height: 100%;
  border-radius: 2px;
  background: v-bind(gradientBg);
}
</style>