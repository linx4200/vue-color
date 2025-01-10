<template>
  <div class="vc-saturation"
    :style="{background: bgColor}"
    ref="container"
    @mousedown="handleMouseDown"
    @touchmove="handleChange"
    @touchstart="handleChange">
    <div class="vc-saturation--white"></div>
    <div class="vc-saturation--black"></div>
    <div class="vc-saturation-pointer" :style="{top: pointerTop, left: pointerLeft}">
      <div class="vc-saturation-circle"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import clamp from 'clamp';
import throttle from 'lodash.throttle';
import { useTinyColorModel, EmitEventNames, type useTinyColorModelProps } from '../../composable/vmodel.ts';
import { getPageXYFromEvent, getAbsolutePosition } from '../../utils/dom.ts';
import tinycolor from 'tinycolor2';

type Props = {
  value?: {
    hsv: {
      h: number;
      s: number;
      v: number;
      a?: number;
    }
  };
}

const emit = defineEmits(['change'].concat(EmitEventNames));
const props = defineProps<Props & useTinyColorModelProps>();
const { colorRef: tinyColorRef, updateColor: updateTinyColor } = useTinyColorModel(props, emit);

const hsv = computed(() => {
  return props.value?.hsv ?? tinyColorRef.value.toHsv();
});

const bgColor = computed(() => {
  return `hsl(${hsv.value.h}, 100%, 50%)`;
});
const pointerTop = computed(() => {
  return (-(hsv.value.v * 100) + 1) + 100 + '%';
});
const pointerLeft = computed(() => {
  return hsv.value.s * 100 + '%';
});

const containerRef = useTemplateRef('container');

const throttleFn = throttle((fn, args) => {
  fn(args);
}, 20,
{
  'leading': true,
  'trailing': false
});

function handleChange (e: MouseEvent | TouchEvent, skip = false) {
  !skip && e.preventDefault()
  var container = containerRef.value;
  if (!container) {
    // for some edge cases, container may not exist. see #220
    return
  }
  const containerWidth = container.clientWidth
  const containerHeight = container.clientHeight

  const {x: xOffset, y: yOffset } = getAbsolutePosition(container);
  const {x: pageX, y: pageY } = getPageXYFromEvent(e);

  const left = clamp(pageX - xOffset, 0, containerWidth);
  const top = clamp(pageY - yOffset, 0, containerHeight);

  const saturation = left / containerWidth;
  const brightness = clamp(-(top / containerHeight) + 1, 0, 1);

  throttleFn(onChange, {
    h: hsv.value.h,
    s: saturation,
    v: brightness,
    a: hsv.value.a,
  })
}

function onChange (param: NonNullable<Props['value']>['hsv']) {
  if (props.value) {
    emit('change', param);
  }
  // tiny color internally doesn't handle saturation and value of HSV mutation
  // so, need to create a new tiny color instance
  updateTinyColor(tinycolor(param));
}

function handleMouseDown () {
  window.addEventListener('mousemove', handleChange)
  window.addEventListener('mouseup', handleChange)
  window.addEventListener('mouseup', handleMouseUp)
}

function handleMouseUp () {
  unbindEventListeners();
}

function unbindEventListeners () {
  window.removeEventListener('mousemove', handleChange);
  window.removeEventListener('mouseup', handleChange);
  window.removeEventListener('mouseup', handleMouseUp);
}

</script>

<style>
.vc-saturation,
.vc-saturation--white,
.vc-saturation--black {
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.vc-saturation--white {
  background: linear-gradient(to right, #fff, rgba(255,255,255,0));
}
.vc-saturation--black {
  background: linear-gradient(to top, #000, rgba(0,0,0,0));
}
.vc-saturation-pointer {
  cursor: pointer;
  position: absolute;
}
.vc-saturation-circle {
  cursor: head;
  width: 4px;
  height: 4px;
  box-shadow: 0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0,0,0,.3), 0 0 1px 2px rgba(0,0,0,.4);
  border-radius: 50%;
  transform: translate(-2px, -2px);
}
</style>