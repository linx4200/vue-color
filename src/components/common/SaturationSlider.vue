<!-- eslint-disable vuejs-accessibility/no-static-element-interactions -->
<template>
  <div
    class="vc-saturation-slider bg"
    :style="{background: bgColor}"
    ref="containerRef"
    @mousedown="handleMouseDown"
    @touchmove="handleChange"
    @touchstart="handleChange"
    role="application"
    aria-label="Saturation and brightness picker"
  >
    <div class="bg white"></div>
    <div class="bg black"></div>

    <div
      class="picker-wrap"
      :style="{top: pointerTop, left: pointerLeft}"
      role="slider"
      tabindex="0"
      aria-valuemin="0"
      aria-valuemax="1"
      aria-label="press arrow to change saturation or brightness"
      aria-valuenow="?"
      :aria-valuetext="`saturation: ${hsv.s.toFixed(0)}%, brightness: ${hsv.v.toFixed(0)}%`"
      @keydown="handleKeyDown"
    >
      <div class="picker"></div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, ref, onUnmounted } from 'vue';
import { defineColorModel, EmitEventNames, colorModelProps } from '../../composable/colorModel.ts';
import { getPageXYFromEvent, getAbsolutePosition, resolveArrowDirection } from '../../utils/dom.ts';
import { clamp } from '../../utils/math.ts';
import { throttle } from '../../utils/throttle.ts';

const emit = defineEmits(['change'].concat(EmitEventNames));
const props = defineProps({
  /** Use this hue value to render background first.
   * Second priority is the hue value from `v-model` or `v-model:tineColor`.
   * */
  hue: Number,
  ...colorModelProps
});

/** Record the location where the user clicks */
const pointerLeftRef = ref(0);

const tinyColorRef = defineColorModel(props, emit);

const hsv = computed(() => {
  return tinyColorRef.value.toHsv();
});

const hue = computed(() => {
  return props.hue ?? hsv.value.h;
});

const bgColor = computed(() => {
  return `hsl(${hue.value}, 100%, 50%)`;
});

const pointerTop = computed(() => {
  return (-(hsv.value.v * 100) + 1) + 100 + '%';
});
const pointerLeft = computed(() => {
  // 1. Because when v = 0.01 tinycolor conversion will be inaccurate, use the click position
  // 2. Because the hue value is lost when v = 0 (as expected), the clicked position is used
  if (hsv.value.v <= 0.01) {
    return pointerLeftRef.value * 100 + '%';
  }
  return hsv.value.s * 100 + '%';
});

// No using `useTemplateRef` because of vue 2.7 compatibility
const containerRef = ref<HTMLElement | null>(null);

function handleChange (e: MouseEvent | TouchEvent, skip = false) {
  if(!skip) {
    e.preventDefault();
  }
  var container = containerRef.value;
  if (!container) {
    // for some edge cases, container may not exist. see #220
    /* v8 ignore next 2 */
    return;
  }
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  const { x: xOffset, y: yOffset } = getAbsolutePosition(container);
  const { x: pageX, y: pageY } = getPageXYFromEvent(e);

  const left = clamp(pageX - xOffset, 0, containerWidth);
  const top = clamp(pageY - yOffset, 0, containerHeight);

  const saturation = left / containerWidth;
  const brightness = clamp(1 - (top / containerHeight), 0, 1);

  pointerLeftRef.value = saturation;

  // s and v is multiplied by 100 due to prevention of dithering
  let s = Math.round(saturation * 100);
  let v = Math.round(brightness * 100);

  // "1" is treated as percentage number in tinycolor
  if (s === 1) {
    s = 0.01;
  }
  if (v === 1) {
    v = 0.01;
  }

  onChange({
    h: hue.value,
    s,
    v,
    a: hsv.value.a,
  });
}

function onChange (param: { h: number, s: number, v: number, a: number }) {
  // tiny color internally doesn't handle saturation and brightness of HSV mutation
  // so, need to create a new tiny color instance
  tinyColorRef.value = param;
}

const throttledHandleChange = throttle(handleChange, 20);

function handleMouseDown () {
  window.addEventListener('mousemove', throttledHandleChange)
  window.addEventListener('mouseup', throttledHandleChange)
  window.addEventListener('mouseup', handleMouseUp)
}

function handleMouseUp () {
  unbindEventListeners();
}

function unbindEventListeners () {
  window.removeEventListener('mousemove', throttledHandleChange);
  window.removeEventListener('mouseup', throttledHandleChange);
  window.removeEventListener('mouseup', handleMouseUp);
}

function handleKeyDown(e: KeyboardEvent) {
  e.preventDefault();
  const direction = resolveArrowDirection(e);
  switch(direction) {
    case 'left': {
      const newSaturation = hsv.value.s - 0.01;
      onChange({
        ...hsv.value,
        s: newSaturation >= 0 ? newSaturation : 0
      })
      break;
    }
    case 'right': {
      const newSaturation = hsv.value.s + 0.01;
      onChange({
        ...hsv.value,
        s: newSaturation > 1 ? 1 : newSaturation
      })
      break;
    }
    case 'up': {
      const newBrightness = hsv.value.v + 0.01;
      onChange({
        ...hsv.value,
        v: newBrightness > 1 ? 1 : newBrightness
      })
      break;
    }
    case 'down': {
      const newBrightness = hsv.value.v - 0.01;
      onChange({
        ...hsv.value,
        v: newBrightness < 0 ? 0 : newBrightness
      })
      break;
    };
  }
}

onUnmounted(() => {
  unbindEventListeners();
});
</script>

<style scoped>
.bg {
  cursor: crosshair;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.white {
  background: linear-gradient(to right, #fff, rgba(255,255,255,0));
}

.black {
  background: linear-gradient(to top, #000, rgba(0,0,0,0));
}

.picker-wrap {
  cursor: pointer;
  position: absolute;
}

.picker {
  cursor: move;
  width: 4px;
  height: 4px;
   box-shadow:
    0 0 0 1.6px var(--vc-picker-bg),
    inset 0 0 1px 1px rgba(0, 0, 0, 0.3),
    0 0 1px 2px rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  transform: translate(-2px, -2px);
}
</style>