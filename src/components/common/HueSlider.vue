<template>
  <div class="vc-hue-slider">
    <div
      :class="{
        container: true,
        horizontal: props.direction === 'horizontal',
        vertical: props.direction === 'vertical',
      }"
      ref="containerRef"
      @mousedown="handleMouseDown"
      @touchstart="handleMouseDown"
      @keydown="handleKeyDown"
      role="slider"
      :aria-valuenow="hue"
      aria-valuemin="0"
      aria-valuemax="360"
      aria-label="Hue"
      tabindex="0"
    >
      <div class="picker-wrap" :style="{top: pointerTop, left: pointerLeft}" role="presentation">
        <slot>
          <div class="picker"></div> <!-- fallback content -->
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, computed, ref, onUnmounted } from 'vue';
import { getPageXYFromEvent, getAbsolutePosition, resolveArrowDirection } from '../../utils/dom.ts';
import { throttle } from '../../utils/throttle.ts';

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

const emit = defineEmits(['update:modelValue'])

const hue = computed(() => {
  const value = Number(props.modelValue);
  return Number.isNaN(value) ? 0 : value;
});

const pullDirection = ref<'right' | 'left' | undefined>();

// No using `useTemplateRef` because of vue 2.7 compatibility
const containerRef = ref<HTMLElement | null>(null);

watch(hue, (newHue, oldHue) => {
  if (newHue !== 0 && newHue - oldHue > 0) pullDirection.value = 'right';
  if (newHue !== 0 && newHue - oldHue < 0) pullDirection.value = 'left';
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

function handleChange (e: MouseEvent | TouchEvent) {

  const container = containerRef.value;
  /* v8 ignore next 4 */
  if (!container) {
    // for some edge cases, container may not exist. see #220
    return
  }
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

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
      h = Math.round(360 * percent / 100);
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
      h =  Math.round(360 * percent / 100)
    }
    if (hue.value !== h) {
      emitChange(h);
    }
  }
}

function emitChange(newHue: number) {
  emit('update:modelValue', newHue);
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

function handleKeyDown(e: KeyboardEvent) {
  e.preventDefault();
  const keyDirection = resolveArrowDirection(e);
  const containerDirection = props.direction;
  const currentValue = hue.value;
  let newValue;
  switch(keyDirection) {
    case 'left': {
      if (containerDirection !== 'horizontal') {
        return;
      }
      newValue = currentValue - 1 < 0 ? 0 : Math.floor(currentValue - 1);
      break;
    }
    case 'right': {
      if (containerDirection !== 'horizontal') {
        return;
      }
      newValue = currentValue + 1 > 360 ? 360 : Math.ceil(currentValue + 1);
      break;
    }
    case 'down': {
      if (containerDirection !== 'vertical') {
        return;
      }
      newValue = currentValue - 1 < 0 ? 0 : Math.floor(currentValue - 1);
      break;
    }
    case 'up': {
      if (containerDirection !== 'vertical') {
        return
      }
      newValue = currentValue + 1 > 360 ? 360 : Math.ceil(currentValue + 1);
      break;
    };
  }
  if (typeof newValue !== 'undefined') {
    emitChange(newValue);
  }
}

onUnmounted(() => {
  unbindEventListeners();
});
</script>

<style scoped>
.vc-hue-slider {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  /** preventing default (scroll) behavior */
  touch-action: none;
}
.horizontal {
  background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
}
.vertical {
  background: linear-gradient(to top, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
}
.container {
  cursor: crosshair;
  position: relative;
  height: 100%;
  border-radius: 2px
}
.picker-wrap {
  position: absolute;
  z-index: 2;
}
.picker {
  margin-top: 1px;
  width: 4px;
  height: 8px;
  border-radius: 1px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
  background: var(--vc-picker-bg);
  cursor: col-resize;
  transform: translateX(-2px);
}
</style>