<template>
  <div :class="['vc-hue', directionClass, $style.wrap]">
    <div :class="$style.container"
      role="slider"
      :aria-valuenow="hue"
      aria-valuemin="0"
      aria-valuemax="360"
      ref="container"
      @mousedown="handleMouseDown"
      @touchmove="handleChange"
      @touchstart="handleChange">
      <div :class="$style.pointer" :style="{top: pointerTop, left: pointerLeft}" role="presentation">
        <div :class="['vc-hue-picker', $style.picker]"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, useCssModule } from 'vue';
import { getPageXYFromEvent, getAbsolutePosition } from '../../utils/dom.ts';

// <Hue /> is not allowed to use tinycolor instance
// because it may lost hue value in some cases:
// saturation is 0, lightness is 0 or 100, value is 0

const classes = useCssModule();

type Props = {
  direction?: 'horizontal' | 'vertical';
  hue?: number;
}

const props = withDefaults(defineProps<Props>(), {
  hue: 0,
  direction: 'horizontal'
});

const emit = defineEmits(['change']);

let previousHueValue = 0;
const pullDirection = ref<'right' | 'left' | undefined>();

const containerRef = useTemplateRef('container');

const hue = computed(() => {
  let h = props.hue;

  if (h !== 0 && h - previousHueValue > 0) pullDirection.value = 'right';
  if (h !== 0 && h - previousHueValue < 0) pullDirection.value = 'left';

  previousHueValue = h

  return h;
})

const directionClass = computed(() => {
  return {
    [classes.horizontal]: props.direction === 'horizontal',
    [classes.vertical]: props.direction === 'vertical'
  }
});

const pointerTop = computed(() => {
  if (props.direction === 'vertical') {
    if (hue.value === 0 && pullDirection.value === 'right') {
      return 0;
    }
    return -((hue.value * 100) / 360) + 100 + '%';
  } else {
    return 0
  }
});

const pointerLeft = computed(() => {
  if (props.direction === 'vertical') {
    return 0
  } else {
    if (hue.value === 0 && pullDirection.value === 'right') return '100%'
    return (hue.value * 100) / 360 + '%'
  }
});

function handleChange (e: MouseEvent | TouchEvent, skip?: boolean) {
  !skip && e.preventDefault()

  const container = containerRef.value;
  if (!container) {
    // for some edge cases, container may not exist. see #220
    /* v8 ignore next 2 */
    return
  }
  const containerWidth = container.clientWidth
  const containerHeight = container.clientHeight

  const {x: xOffset, y: yOffset } = getAbsolutePosition(container);
  const {x: pageX, y: pageY } = getPageXYFromEvent(e);

  const left = pageX - xOffset;
  const top = pageY - yOffset;

  let h;
  let percent;

  if (props.direction === 'vertical') {
    if (top < 0) {
      h = 360;
    } else if (top > containerHeight) {
      h = 0;
    } else {
      percent = -(top * 100 / containerHeight) + 100;
      h = (360 * percent / 100);
    }

    if (hue.value !== h) {
      emitChange(h);
    }
  } else {
    if (left < 0) {
      h = 0
    } else if (left > containerWidth) {
      h = 360
    } else {
      percent = left * 100 / containerWidth
      h = (360 * percent / 100)
    }
    if (hue.value !== h) {
      emitChange(h);
    }
  }
}

function emitChange(h: number) {
  emit('change', h, h - hue.value);
}

function handleMouseDown (e: MouseEvent) {
  handleChange(e, true)
  window.addEventListener('mousemove', handleChange)
  window.addEventListener('mouseup', handleMouseUp)
}

function handleMouseUp () {
  unbindEventListeners();
}

function unbindEventListeners () {
  window.removeEventListener('mousemove', handleChange)
  window.removeEventListener('mouseup', handleMouseUp)
}
</script>

<style module>
.wrap {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  border-radius: 2px;
}
.horizontal {
  background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
}
.vertical {
  background: linear-gradient(to top, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
}
.container {
  cursor: pointer;
  margin: 0 2px;
  position: relative;
  height: 100%;
}
.pointer {
  z-index: 2;
  position: absolute;
}
.picker {
  cursor: pointer;
  margin-top: 1px;
  width: 4px;
  border-radius: 1px;
  height: 8px;
  box-shadow: 0 0 2px rgba(0, 0, 0, .6);
  background: #fff;
  transform: translateX(-2px) ;
}
</style>