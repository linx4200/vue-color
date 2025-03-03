<template>
  <div role="application" aria-label="Slider color picker" :class="$style.wrap">
    <div :class="$style.hue">
      <hue :hue="retainedHueRef" @change="setHue"></hue>
    </div>
    <div :class="$style.swatches" role="group">
      <div :class="$style.swatch" v-for="(swatch, index) in normalizedSwatches" :key="index" :data-index="index"
        :aria-label="'color:' + hex"
        role="button"
        @click="handleSwClick(swatch)">
        <div
          :class="{
            [$style.swatchPicker]: true,
            [$style.swatchPickerActive]: isActive(swatch),
            [$style.swatchPickerWhite]: swatch.l === 1
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
import { useTinyColorModel, EmitEventNames, type useTinyColorModelProps } from '../composable/vmodel';
import { hueModel } from '../composable/hue';
import Hue from './common/HueSlider.vue';

type Prop = {
  /** lightness values */
  swatches?: ({ s: number, l: number} | string)[];
}

const props = withDefaults(defineProps<useTinyColorModelProps & Prop>(), {
  swatches: () => defaultSwatches
});
const emit = defineEmits(EmitEventNames);

const { colorRef: tinyColorRef, updateColor: updateTinyColor } = useTinyColorModel(props, emit);
const { setHue, retainedHueRef } = hueModel(tinyColorRef, updateTinyColor);

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
  updateTinyColor({
    h: hsl.value.h,
    s: swatch.s,
    l: swatch.l,
  })
}
</script>

<style module>
.wrap {
  position: relative;
  width: 410px;
}
.hue {
  height: 12px;
  position: relative;
}
.hue :global(.vc-hue-picker) {
  width: 14px;
  height: 14px;
  border-radius: 6px;
  transform: translate(-7px, -2px);
  background-color: rgb(248, 248, 248);
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.37);
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
.swatch:first-child .swatchPicker {
  border-radius: 2px 0px 0px 2px;
}
.swatch:last-child {
  margin-right: 0;
}
.swatch:last-child .swatchPicker {
  border-radius: 0px 2px 2px 0px;
}
.swatchPicker {
  cursor: pointer;
  height: 12px;
}
.swatch:nth-child(n) .swatchPicker.swatchPickerActive {
  transform: scaleY(1.8);
  border-radius: 3.6px/2px;
}
.swatchPickerWhite {
  box-shadow: inset 0 0 0 1px #ddd;
}
.swatchPickerActive.swatchPickerWhite {
  box-shadow: inset 0 0 0 0.6px #ddd;
}
</style>
