<template>
  <HueSlider
    v-bind="$attrs"
    :class="['vc-hue-wrap', $attrs.class]"
  />
</template>

<script setup lang="ts">
import HueSlider from './common/HueSlider.vue';
import { useAttrs, computed } from 'vue';

const attrs = useAttrs();
const thumbColor = computed(() => {
  return `hsl(${attrs.modelValue ?? 0}, 100%, 50%)`;
});
</script>

<style scoped>
.vc-hue-wrap {
  position: relative;
  width: 100%;
  height: 8px;
}
.vc-hue-wrap :deep(.container) {
  border-radius: 4px;
}
.vc-hue-wrap :deep(.picker) {
  width: 20px;
  height: 20px;
  margin: 0;
  border-radius: 50%;
  box-shadow: none;
  border: 2px white solid;
  background-color: v-bind('thumbColor');
  transform: translateX(-12px) translateY(-8px);
}
</style>
