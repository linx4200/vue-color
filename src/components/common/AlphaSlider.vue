<template>
  <div class="vc-alpha-slider">
    <div class="checkerboard">
      <Checkerboard />
    </div>
    <div class="gradient" :style="{background: gradientColor}"></div>
    <div
        class="slider"
        ref="containerRef"
        @mousedown="handleMouseDown"
        @touchstart="handleMouseDown"
        role="slider"
        aria-label="Transparency"
        aria-valuemax="1"
        aria-valuemin="0"
        :aria-valuenow="alpha.toFixed(1)"
        tabindex="0"
        @keydown="handleKeydown"
      >
      <div class="picker-wrap" :style="{left: alpha * 100 + '%'}">
        <div class="picker"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import tinycolor from 'tinycolor2';
import { ref, computed, onUnmounted } from 'vue';
import Checkerboard from './CheckerboardBG.vue';
import { defineColorModel, EmitEventNames } from '../../composable/colorModel.ts';
import { getPageXYFromEvent, getAbsolutePosition, resolveArrowDirection } from '../../utils/dom.ts';
import { throttle } from '../../utils/throttle.ts';

type Props = {
  /**
   * Used with `v-model:tinyColor`. Accepts any valid TinyColor input format.
   */
  tinyColor?: tinycolor.ColorInput;
  /**
   * Used with `v-model`. Accepts any valid TinyColor input format.
   */
  modelValue?: tinycolor.ColorInput;
  /**
   * Fallback for `v-model` compatibility in Vue 2.7.
   * Accepts any valid TinyColor input.
   */
  value?: tinycolor.ColorInput;
};

const props = defineProps<Props>();
const emit = defineEmits(EmitEventNames);

const colorRef = defineColorModel(props, emit);

const gradientColor = computed(() => {
  const rgba = colorRef.value.toRgb();
  const rgbStr = [rgba.r, rgba.g, rgba.b].join(',');
  return 'linear-gradient(to right, rgba(' + rgbStr + ', 0) 0%, rgba(' + rgbStr + ', 1) 100%)';
});

const alpha = computed(() => colorRef.value.getAlpha());

// No using `useTemplateRef` because of vue 2.7 compatibility
const containerRef = ref<HTMLElement | null>(null);

function handleChange (e: MouseEvent | TouchEvent) {

  const container = containerRef.value;
    /* v8 ignore next 4 */
  if (!container) {
    // for some edge cases, container may not exist. see #220
    return
  }
  const containerWidth = container.clientWidth;

  const { x: xOffset } = getAbsolutePosition(container);
  const { x: pageX } = getPageXYFromEvent(e);
  const left = pageX - xOffset;

  let a;
  if (left < 0) {
    a = 0;
  } else if (left > containerWidth) {
    a = 1;
  } else {
    a = Math.round(left * 100 / containerWidth) / 100;
  }

  if (alpha.value !== a) {
    colorRef.value = colorRef.value.setAlpha(a).clone();
  }
}

const throttledHandleChange = throttle(handleChange);

function handleMouseDown (e: MouseEvent | TouchEvent) {
  handleChange(e);
  if (e.type.startsWith('mouse')) {
    window.addEventListener('mousemove', throttledHandleChange);
    window.addEventListener('mouseup', handleMouseUp);
  } else {
    window.addEventListener('touchmove', throttledHandleChange)
    window.addEventListener('touchend', handleMouseUp);
  }
}

/* v8 ignore next 3 */
function handleMouseUp () {
  unbindEventListeners();
}

function unbindEventListeners () {
  window.removeEventListener('mousemove', throttledHandleChange);
  window.removeEventListener('mouseup', handleMouseUp);

  window.removeEventListener('touchmove', throttledHandleChange);
  window.removeEventListener('touchend', handleMouseUp);
}

function handleKeydown(e: KeyboardEvent) {
  e.preventDefault();
  const keyDirection = resolveArrowDirection(e);
  const currentValue = alpha.value;
  let newValue;
  switch(keyDirection) {
    case 'left': {
      newValue = currentValue - 0.1 < 0 ? 0 : currentValue - 0.1;
      break;
    }
    case 'right': {
      newValue = currentValue + 0.1 > 1 ? 1 : currentValue + 0.1;
      break;
    }
  }
  if (typeof newValue !== 'undefined') {
    colorRef.value = colorRef.value.setAlpha(newValue).clone();
  }
}

onUnmounted(() => {
  unbindEventListeners();
});
</script>

<style scoped>
.vc-alpha-slider {
  /** preventing default (scroll) behavior */
  touch-action: none;
}
.checkerboard {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  border-radius: 2px;
  overflow: hidden;
}
.gradient {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
}
.slider {
  cursor: pointer;
  z-index: 2;
  margin: 0 3px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
}
.picker-wrap {
  position: absolute;
  z-index: 2;
}
.picker {
  width: 4px;
  height: 8px;
  margin-top: 1px;
  border-radius: 1px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
  background: var(--vc-picker-bg);
  cursor: pointer;
  transform: translateX(-2px);
}
</style>
