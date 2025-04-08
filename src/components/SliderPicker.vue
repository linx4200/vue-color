<template>
  <div role="application" aria-label="Slider color picker" class="vc-slider-picker">
    <div class="hue">
      <Hue :modelValue="hueRef" @update:modelValue="updateHueRef" />
    </div>
    <div class="alpha" v-if="props.alpha">
      <AlphaSlider v-model:tinyColor="tinyColorRef" />
    </div>
    <div
      v-if="normalizedSwatches.length > 0"
      class="swatches"
      role="listbox"
      aria-label="Color segments in different shades of one color"
      tabindex="0"
    >
      <div
        v-for="(swatch, index) in normalizedSwatches"
        class="swatch"
        :key="index"
        data-index="index"
        @click="handleSwClick(swatch)"
        role="option"
        :aria-label="'Color:' + hex"
        :title="hex"
        @keydown.space="handleSwClick(swatch)"
        :aria-selected="isActive(swatch)"
        tabindex="0"
      >
        <div
          :class="{
            'picker': true,
            'picker_active': isActive(swatch),
            'picker_white': swatch.l === 1
          }"
          :style="{background: 'hsl(' + hsl.h + ', ' + swatch.s * 100 + '%, ' + swatch.l * 100 + '%)'}"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
const DEFAULT_SATURATION = 0.5;
const defaultSwatches = [
  { s: DEFAULT_SATURATION, l: 0.8 },
  { s: DEFAULT_SATURATION, l: 0.65 },
  { s: DEFAULT_SATURATION, l: 0.5 },
  { s: DEFAULT_SATURATION, l: 0.35 },
  { s: DEFAULT_SATURATION, l: 0.2 }
]
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { defineColorModel, EmitEventNames, type useTinyColorModelProps } from '../composable/colorModel';
import { useHueRef } from '../composable/hue';
import Hue from './common/HueSlider.vue';
import AlphaSlider from './common/AlphaSlider.vue';

type Prop = {
  /** lightness values */
  swatches?: ({ s: number, l: number} | string)[];
  alpha?: boolean;
}

const props = withDefaults(defineProps<useTinyColorModelProps & Prop>(), {
  swatches: () => defaultSwatches,
});
const emit = defineEmits(EmitEventNames);

const tinyColorRef = defineColorModel(props, emit);
const { hueRef, updateHueRef } = useHueRef(tinyColorRef);

const hsl = computed(() => tinyColorRef.value.toHsl());
const hex = computed(() => tinyColorRef.value.toHexString());

const normalizedSwatches = computed(() => {
  const swatches = props.swatches;
  return swatches.map(swatch => {
    // to be compatible with another data format ['.80', '.65', '.50', '.35', '.20']
    if (typeof swatch === 'string') {
      return {
        s: DEFAULT_SATURATION,
        l: Number(swatch)
      }
    }
    return swatch
  })
});

const isActive = (swatch: { s: number, l: number }) =>{
  if (hsl.value.l === 1 && swatch.l === 1) {
    return true
  }
  if (hsl.value.l === 0 && swatch.l === 0) {
    return true
  }
  return (
    Math.abs(hsl.value.l - swatch.l) < 0.01 && Math.abs(hsl.value.s - swatch.s) < 0.01
  )
};
const handleSwClick = (swatch: { s: number, l: number }) => {
  tinyColorRef.value = {
    h: hsl.value.h,
    s: swatch.s,
    l: swatch.l,
  };
}
</script>

<style scoped>
.vc-slider-picker {
  position: relative;
  width: 410px;
}
.hue {
  height: 12px;
  position: relative;
}
.hue :deep(.picker), .alpha :deep(.picker) {
  width: 14px;
  height: 14px;
  border-radius: 6px;
  transform: translate(-7px, -2px);
  background-color: rgb(248, 248, 248);
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.37);
}
.alpha {
  height: 12px;
  position: relative;
  margin-top: 20px;
}
.swatches {
  display: flex;
  margin-top: 20px;
}
.swatch {
  margin-right: 1px;
  flex: 1;
  width: 20%;
}
.swatch:first-child {
  margin-right: 1px;
}
.swatch:first-child .picker {
  border-radius: 2px 0px 0px 2px;
}
.swatch:last-child {
  margin-right: 0;
}
.swatch:last-child .picker {
  border-radius: 0px 2px 2px 0px;
}
.picker {
  cursor: pointer;
  height: 12px;
}
.swatch:nth-child(n) .picker_active {
  transform: scaleY(1.8);
  border-radius: 3.6px/2px;
}
.picker_white {
  box-shadow: inset 0 0 0 1px #ddd;
}
.picker_active.picker_white {
  box-shadow: inset 0 0 0 0.6px #ddd;
}
</style>
