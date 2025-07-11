<template>
  <div class="vc-hsv-sliders">
    <div class="slider-wrap">
      <span class="label">H</span>
      <HueSlider :modelValue="hueRef" @update:modelValue="updateHueRef"></HueSlider>
      <EditableInput :value="hueRef.toFixed()" @change="updateHueRef" :a11y="{label: 'hue'}" />
    </div>

    <div class="slider-wrap">
      <span class="label">S</span>
      <BaseSlider
        :style="{background: getSaturationGradient(hueRef, brightness)}"
        aria-label="saturation"
        :model-value="saturation"
        @update:model-value="onSChange"
      ></BaseSlider>
      <EditableInput :value="saturation.toFixed()" @change="onSChange" :a11y="{label: 'saturation'}" :min="0" :max="100" />
    </div>

    <div class="slider-wrap">
      <span class="label">V</span>
      <BaseSlider
        :style="{background: getBrightnessGradient(hueRef, saturation)}"
        aria-label="Brightness"
        :model-value="brightness"
        @update:model-value="onBChange"
      ></BaseSlider>
      <EditableInput :value="brightness.toFixed()" @change="onBChange" :a11y="{label: 'Brightness'}" :min="0" :max="100" />
    </div>

    <div v-if="!disableAlpha" class="slider-wrap">
      <span class="label">A</span>
      <AlphaSlider v-model:tinyColor="tinyColorRef"></AlphaSlider>
      <EditableInput :value="alpha.toFixed(2)" @change="onAlphaChange" :a11y="{label: 'alpha'}" :min="0" :max="1" :step="0.01" />
    </div>
  </div>
</template>

<script setup lang="ts">
import tinycolor from 'tinycolor2';
import { computed, ref } from 'vue';

import BaseSlider from './common/BaseSlider.vue';
import HueSlider from './common/HueSlider.vue';
import AlphaSlider from './common/AlphaSlider.vue';
import EditableInput from './common/EditableInput.vue';

import { defineColorModel, EmitEventNames } from '../composable/colorModel.ts';
import { useHueRef } from '../composable/hue.ts';

type Props = {
  /**
   * Whether to disable the alpha (transparency) channel in the UI.
   * When set to true, the color picker will not display or allow adjustment of alpha values.
   */
  disableAlpha?: boolean;
  /**
   * Whether to disable all input fields in the UI.
   */
  disableFields?: boolean;
  /**
   * Used with `v-model:tinyColor`. Accepts any valid TinyColor input format.
   */
  tinyColor?: tinycolor.ColorInput;
  /**
   * Used with `v-model`. Accepts any valid TinyColor input format.
   */
  modelValue?: tinycolor.ColorInput;
  /**
   * Fallback for `v-model` compatibility in Vue 2.7.
   * Accepts any valid TinyColor input.
   */
  value?: tinycolor.ColorInput;
}

const props = withDefaults(defineProps<Props>(), {
  disableAlpha: false,
  disableFields: false
});

const emit = defineEmits(EmitEventNames);

const tinyColorRef = defineColorModel(props, emit, 'chrome');

const { hueRef, updateHueRef } = useHueRef(tinyColorRef);

const hsv = computed(() => tinyColorRef.value.toHsv());

const saturation = ref(hsv.value.s * 100);

const brightness = ref(hsv.value.v * 100);

const alpha = computed(() => tinyColorRef.value.getAlpha());

const onSChange = (value: number | string) => {
  const s = Number(value);
  saturation.value = s;
  tinyColorRef.value = {
    ...hsv.value,
    s: s / 100
  }
}

const onBChange = (value: number | string) => {
  const b = Number(value);
  brightness.value = b;
  tinyColorRef.value = {
    ...hsv.value,
    l: b / 100
  }
}

const onAlphaChange = (value: number | string) => {
  const a = Number(value);
  tinyColorRef.value = {
    ...hsv.value,
    a
  }
}

function getSaturationGradient(hue: number, brightness: number) {
  const steps = 10;
  const gradientStops: string[] = [];
  for (let i = 0; i <= steps; i++) {
    let s = i / steps;
    const hsvColor = { h: hue, s: s, v: brightness / 100 };
    const rgbColor = tinycolor(hsvColor). toRgb();
    if (rgbColor) {
      const r = Math.round(rgbColor.r);
      const g = Math.round(rgbColor.g);
      const b = Math.round(rgbColor.b);
      gradientStops.push(`rgb(${r} ${g} ${b})`);
    }
  }
  return `linear-gradient(to right, ${gradientStops.join(', ')})`;
}

function getBrightnessGradient(hue: number, saturation: number) {
  const steps = 10;
  const gradientStops: string[] = [];
  for (let i = 0; i <= steps; i++) {
    let v = i / steps;
    const hsvColor = { h: hue, s: saturation / 100, v };
    const rgbColor = tinycolor(hsvColor). toRgb();
    if (rgbColor) {
      const r = Math.round(rgbColor.r);
      const g = Math.round(rgbColor.g);
      const b = Math.round(rgbColor.b);
      gradientStops.push(`rgb(${r} ${g} ${b})`);
    }
  }
  return `linear-gradient(to right, ${gradientStops.join(', ')})`;
}

const thumbColorForH = computed(() => {
  return `hsl(${hueRef.value}, 100%, 50%)`;
});

const thumbColor = computed(() => {
  return tinyColorRef.value.toRgbString();
});

</script>

<style scoped>
.vc-hsv-sliders {
  position: relative;
  width: 100%;
  font-family: Menlo, Consolas, 'Courier New', monospace;
}
.slider-bg {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
}

.slider-wrap {
  display: flex;
  gap: 12px;
  /* equals to the height of the picker */
  height: 24px;
  margin-bottom: 10px;
}
.slider-wrap:last-of-type {
  margin-bottom: 0px;
}

.label {
  display: block;
  /* equals to the height of the container */
  height: 24px;
  color: var(--vc-input-text);
  font-size: 12px;
  line-height: 24px;
  text-transform: uppercase;
  text-align: center;
}

.vc-hsv-sliders :deep(.vc-base-slider) {
  /* margin-top = 1/2 * (pickerHeight - sliderHeight) */
  margin-top: 7px;
  height: 12px;
}
.h-slider :deep(.slider) {
  border-radius: 4px;
  border: 1px solid #ddd;
}
.s-slider :deep(.vc-base-slider), .l-slider :deep(.vc-base-slider) {
  border-radius: 4px;
  border: 1px solid #ddd;
}
.vc-hsv-sliders :deep(.checkerboard) {
  border-radius: 4px;
}
.vc-hsv-sliders :deep(.gradient) {
  border-radius: 4px;
  border: 1px solid #ddd;
}
.vc-hsv-sliders :deep(.slider) {
  margin: 0;
}
.vc-hsv-sliders :deep(.picker) {
  width: 20px;
  height: 20px;
  margin: 0;
  border-radius: 50%;
  box-shadow: none;
  border: 2px white solid;
  /* translateY: (selfWidth + selfBorder*2) - sliderHight * 1/2  */
  /* translateX: (selfWidth + selfBorder*2) * 1/2  */
  transform: translateX(-12px) translateY(-6px);
}

.h-slider :deep(.picker) {
  background-color: v-bind('thumbColorForH');
}

.s-slider :deep(.picker), .l-slider :deep(.picker) {
  background-color: v-bind('thumbColor');
}

/* .a-slider :deep(.picker) {
  background-color: v-bind('thumbColorForAlpha');
} */

.vc-hsv-sliders :deep(.vc-editable-input) {
  border-bottom: 1px solid var(--vc-input-border);
}

.vc-hsv-sliders :deep(.vc-input-input) {
  width: 50px;
  background: none;
  color: var(--vc-input-text);
  font-size: 12px;
  text-align: center;
}
</style>
