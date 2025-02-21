<template>
  <div :class="$style.container">
    <div :class="$style.checkerboard">
      <Checkerboard />
    </div>
    <div :class="['vc-alpha-gradient', $style.gradient]" :style="{background: gradientColor}"></div>
    <div
        :class="$style.container"
        ref="container"
        data-testid="slider-container"
        @mousedown="handleMouseDown"
        @touchmove="handleChange"
        @touchstart="handleChange"
      >
      <div :class="$style.pointer" :style="{left: alpha * 100 + '%'}" :aria-label="`current alpha value is ${alpha}`" role="slider">
        <div :class="['vc-alpha-picker', $style.picker]"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef, defineProps } from 'vue';
import Checkerboard from './Checkerboard.vue';
import { useTinyColorModel, EmitEventNames, type useTinyColorModelProps } from '../../composable/vmodel.ts';
import { getPageXYFromEvent, getAbsolutePosition } from '../../utils/dom.ts';

const props = defineProps<useTinyColorModelProps>();
const emit = defineEmits(EmitEventNames);

const { colorRef, updateColor } = useTinyColorModel(props, emit);

const gradientColor = computed(() => {
  const rgba = colorRef.value.toRgb();
  const rgbStr = [rgba.r, rgba.g, rgba.b].join(',');
  return 'linear-gradient(to right, rgba(' + rgbStr + ', 0) 0%, rgba(' + rgbStr + ', 1) 100%)';
});

const alpha = computed(() => colorRef.value.getAlpha());

const containerRef = useTemplateRef('container');

function handleChange (e: MouseEvent | TouchEvent, skip = false) {
  !skip && e.preventDefault();

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
    colorRef.value.setAlpha(a);
    updateColor(colorRef.value);
  }
}

function handleMouseDown (e: MouseEvent) {
  handleChange(e, true);
  window.addEventListener('mousemove', handleChange);
  window.addEventListener('mouseup', handleMouseUp);
}

function handleMouseUp () {
  unbindEventListeners();
}

function unbindEventListeners () {
  window.removeEventListener('mousemove', handleChange);
  window.removeEventListener('mouseup', handleMouseUp);
}

</script>

<style module>
.container {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
}
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
.container {
  cursor: pointer;
  position: relative;
  z-index: 2;
  height: 100%;
  margin: 0 3px;
}
.pointer {
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
