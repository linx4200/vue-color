<script setup lang="ts">
import { computed } from 'vue';

type Props = {
  size?: number;
  white?: string;
  grey?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 8,
  white: '#fff',
  grey: '#e6e6e6'
});

/**
 * get base 64 data by canvas
 *
 * @param {String} c1 hex color
 * @param {String} c2 hex color
 * @param {Number} size
 */
function renderCheckerboard (c1: string, c2: string, size: number) {
  // Won't render in server
  // todo: check ssr
  /* v8 ignore next 3 */
  if (typeof document === 'undefined') {
    return null
  }
  var canvas = document.createElement('canvas')
  canvas.width = canvas.height = size * 2
  var ctx = canvas.getContext('2d')
  // If no context can be found, return early.
  /* v8 ignore next 3 */
  if (!ctx) {
    return null
  }
  ctx.fillStyle = c1
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = c2
  ctx.fillRect(0, 0, size, size)
  ctx.translate(size, size)
  ctx.fillRect(0, 0, size, size)
  return canvas.toDataURL()
}

function getCheckerboard (c1: string, c2: string, size: number) {
  return renderCheckerboard(c1, c2, size);
}

const backgroundImage = computed(() => `url(${getCheckerboard(props.white, props.grey, props.size)})`);

</script>

<template>
  <div :class="[$style.checkerboard, 'vc-checkerboard']" :style="{ backgroundImage }"></div>
</template>

<style module>
.checkerboard {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-size: contain;
}
</style>
