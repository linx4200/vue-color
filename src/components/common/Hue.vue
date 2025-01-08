<template>
  <div :class="['vc-hue', directionClass]">
    <div class="vc-hue-container"
      role="slider"
      :aria-valuenow="hue"
      aria-valuemin="0"
      aria-valuemax="360"
      ref="container"
      @mousedown="handleMouseDown"
      @touchmove="handleChange"
      @touchstart="handleChange">
      <div class="vc-hue-pointer" :style="{top: pointerTop, left: pointerLeft}" role="presentation">
        <div class="vc-hue-picker"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { withDefaults, computed, ref, useTemplateRef, defineEmits } from 'vue';
import { getPageXYFromEvent } from '../../utils/events.ts';
import { useTinyColorModel, EmitEventName, type useTinyColorModelProps } from '../../composable/color';

type Props = {
  value?: {
    hsl: {
      h: number;
      s: number;
      l: number;
      a: number;
    }
  };
  direction: 'horizontal' | 'vertical';
}

const props = withDefaults(defineProps<Props & useTinyColorModelProps>(), {
  direction: 'horizontal'
});

const emit = defineEmits(['change', EmitEventName]);

const { colorRef: tinyColorRef, updateColor: updateTinyColor } = useTinyColorModel(props, emit);

const previousHueValue = ref(0);
const pullDirection = ref<'right' | 'left' | undefined>();

const containerRef = useTemplateRef('container');

const hue = computed(() => {
  const h = props.value?.hsl.h || tinyColorRef.value.toHsl().h;

  if (h !== 0 && h - previousHueValue.value > 0) pullDirection.value = 'right';
  if (h !== 0 && h - previousHueValue.value < 0) pullDirection.value = 'left';
  previousHueValue.value = h

  return h;
})

const directionClass = computed(() => {
  return {
    'vc-hue--horizontal': props.direction === 'horizontal',
    'vc-hue--vertical': props.direction === 'vertical'
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
    return
  }
  const containerWidth = container.clientWidth
  const containerHeight = container.clientHeight

  const scrollX = window.screenX || window.pageXOffset;
  const scrollY = window.screenY || window.pageYOffset;
  const xOffset = container.getBoundingClientRect().left + scrollX;
  const yOffset = container.getBoundingClientRect().top + scrollY;
  const pageX = getPageXYFromEvent(e);
  const pageY = getPageXYFromEvent(e, 'y');
  const left = pageX - xOffset;
  const top = pageY - yOffset;

  let h;
  let percent;

  if (props.direction === 'vertical') {
    if (top < 0) {
      h = 360
    } else if (top > containerHeight) {
      h = 0
    } else {
      percent = -(top * 100 / containerHeight) + 100
      h = (360 * percent / 100)
    }

    if (hue.value !== h) {
      if (props.value) {
        emit('change', {
          h: h,
          s: props.value.hsl.s,
          l: props.value.hsl.l,
          a: props.value.hsl.a,
          // source: 'hsl'
        })
      }
      tinyColorRef.value.spin(h - hue.value);
      updateTinyColor(tinyColorRef.value);
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
      if (props.value) {
        emit('change', {
          h: h,
          s: props.value.hsl.s,
          l: props.value.hsl.l,
          a: props.value.hsl.a,
          // source: 'hsl'
        })
      }
      tinyColorRef.value.spin(h - hue.value);
      updateTinyColor(tinyColorRef.value);
    }
  }
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

<style>
.vc-hue {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  border-radius: 2px;
}
.vc-hue--horizontal {
  background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
}
.vc-hue--vertical {
  background: linear-gradient(to top, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
}
.vc-hue-container {
  cursor: pointer;
  margin: 0 2px;
  position: relative;
  height: 100%;
}
.vc-hue-pointer {
  z-index: 2;
  position: absolute;
}
.vc-hue-picker {
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