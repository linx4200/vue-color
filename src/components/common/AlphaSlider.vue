<template>
  <div class="vc-alpha-slider">
    <div class="checkerboard">
      <Checkerboard />
    </div>
    <div class="gradient" :style="{background: gradientColor}"></div>
    <div
        class="slider"
        ref="container"
        @mousedown="handleMouseDown"
        @touchmove="handleChange"
        @touchstart="handleChange"
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
import { computed, useTemplateRef } from 'vue';
import Checkerboard from './CheckerboardBG.vue';
import { defineColorModel, EmitEventNames, type useTinyColorModelProps } from '../../composable/colorModel.ts';
import { getPageXYFromEvent, getAbsolutePosition, resolveArrowDirection } from '../../utils/dom.ts';
import { throttle } from '../../utils/throttle.ts';

const props = defineProps<useTinyColorModelProps>();
const emit = defineEmits(EmitEventNames);

const colorRef = defineColorModel(props, emit);

const gradientColor = computed(() => {
  const rgba = colorRef.value.toRgb();
  const rgbStr = [rgba.r, rgba.g, rgba.b].join(',');
  return 'linear-gradient(to right, rgba(' + rgbStr + ', 0) 0%, rgba(' + rgbStr + ', 1) 100%)';
});

const alpha = computed(() => colorRef.value.getAlpha());

const containerRef = useTemplateRef('container');

function handleChange (e: MouseEvent | TouchEvent, skip = false) {
  if (!skip) {
    e.preventDefault();
  }

  const container = containerRef.value;
  if (!container) {
    // for some edge cases, container may not exist. see #220
    /* v8 ignore next 2 */
    return
  }
  const containerWidth = container.clientWidth

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

function handleMouseDown (e: MouseEvent) {
  handleChange(e, true);
  window.addEventListener('mousemove', throttledHandleChange);
  window.addEventListener('mouseup', handleMouseUp);
}

function handleMouseUp () {
  unbindEventListeners();
}

function unbindEventListeners () {
  window.removeEventListener('mousemove', throttledHandleChange);
  window.removeEventListener('mouseup', handleMouseUp);
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
</script>

<style scoped>
.checkerboard {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
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
  z-index: 2;
  position: absolute;
}
.picker {
  cursor: pointer;
  width: 4px;
  border-radius: 1px;
  height: 8px;
  box-shadow: 0 0 2px rgba(0, 0, 0, .6);
  background: #fff;
  margin-top: 1px;
  transform: translateX(-2px);
}
</style>
