<script setup lang="ts">
type Props = {
  size?: number;
  white?: string;
  grey?: string;
}

// todo: does this cache work ?
let cache: Record<string, string> = {};

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
  if (typeof document === 'undefined') {
    return null
  }
  var canvas = document.createElement('canvas')
  canvas.width = canvas.height = size * 2
  var ctx = canvas.getContext('2d')
  // If no context can be found, return early.
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

  // get checkerboard base data and cache
  function getCheckerboard (c1: string, c2: string, size: number) {
    const key = c1 + ',' + c2 + ',' + size;

    if (cache[key]) {
      return cache[key];
    } else {
      var checkerboard = renderCheckerboard(c1, c2, size)
      if (checkerboard) {
        cache[key] = checkerboard;
      }
      return checkerboard;
    }
  }

  const backgroundImage = `url(${getCheckerboard(props.white, props.grey, props.size)})`;

</script>

<template>
  <div class="vc-checkerboard" :style="{ backgroundImage }"></div>
</template>

<style>
.vc-checkerboard {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-size: contain;
}
</style>
