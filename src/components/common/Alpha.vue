<template>
  <div class="vc-alpha">
    <div class="vc-alpha-checkerboard-wrap">
      <Checkerboard />
    </div>
    <div class="vc-alpha-gradient" :style="{background: gradientColor}"></div>
    <div class="vc-alpha-container" ref="container"
        @mousedown="handleMouseDown"
        @touchmove="handleChange"
        @touchstart="handleChange">
      <div class="vc-alpha-pointer" :style="{left: alpha * 100 + '%'}">
        <div class="vc-alpha-picker"></div>
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
    return
  }
  const containerWidth = container.clientWidth

  const { x: xOffset } = getAbsolutePosition(container);
  const { x: pageX } = getPageXYFromEvent(e);
  const left = pageX - xOffset

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

<style>
.vc-alpha {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
}
.vc-alpha-checkerboard-wrap {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  overflow: hidden;
}
.vc-alpha-gradient {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
}
.vc-alpha-container {
  cursor: pointer;
  position: relative;
  z-index: 2;
  height: 100%;
  margin: 0 3px;
}
.vc-alpha-pointer {
  z-index: 2;
  position: absolute;
}
.vc-alpha-picker {
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
