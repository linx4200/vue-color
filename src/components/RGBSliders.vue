<template>
  <div class="vc-rgb-sliders">
    <div class="slider-wrap">
      <span class="label">R</span>
      <BaseSlider
        aria-label="red"
        :model-value="rgb.r"
        @update:model-value="(v) => onChange('r', v)"
        :max="255"
      >
        <template #background>
          <div class="gradient" :style="{background: redSliderBG}"></div>
        </template>
      </BaseSlider>
      <EditableInput v-if="!disableFields" :value="rgb.r" @change="(v) => onChange('r', v)" :a11y="{label: 'red'}" :min="0" :max="255" />
    </div>

    <div class="slider-wrap">
      <span class="label">G</span>
      <BaseSlider
        aria-label="green"
        :model-value="rgb.g"
        @update:model-value="(v) => onChange('g', v)"
        :max="255"
      >
        <template #background>
          <div class="gradient" :style="{background: greenSliderBG}"></div>
        </template>
      </BaseSlider>
      <EditableInput v-if="!disableFields" :value="rgb.g" @change="(v) => onChange('g', v)" :a11y="{label: 'green'}" :min="0" :max="255" />
    </div>

    <div class="slider-wrap">
      <span class="label">B</span>
      <BaseSlider
        aria-label="blue"
        :model-value="rgb.b"
        @update:model-value="(v) => onChange('b', v)"
        :max="255"
      >
        <template #background>
          <div class="gradient" :style="{background: blueSliderBG}"></div>
        </template>
      </BaseSlider>
      <EditableInput v-if="!disableFields" :value="rgb.b" @change="(v) => onChange('b', v)" :a11y="{label: 'blue'}" :min="0" :max="255" />
    </div>

    <div v-if="!disableAlpha" class="slider-wrap a-slider">
      <span class="label">A</span>
      <AlphaSlider v-model:tinyColor="tinyColorRef"></AlphaSlider>
      <EditableInput v-if="!disableFields" :value="alpha.toFixed(2)" @change="(v) => onChange('a', v)" :a11y="{label: 'alpha'}" :min="0" :max="1" :step="0.01" />
    </div>
  </div>
</template>

<script lang="ts">
const getGradient = (key: 'r' | 'g' | 'b', color: {r: number, g: number, b: number}) => {
  const steps = 255;
  const gradientStops = [];
  for(let i = 1; i <= steps; i++) {
    const {r, g, b} = {
      ...color,
      [key]: i
    } as typeof color;
    gradientStops.push(`rgb(${r}, ${g}, ${b})`);
  }

  return `linear-gradient(to right, ${gradientStops.join(', ')})`;
}
</script>

<script setup lang="ts">
import tinycolor from 'tinycolor2';
import { computed } from 'vue';

import BaseSlider from './common/BaseSlider.vue';
import AlphaSlider from './common/AlphaSlider.vue';
import EditableInput from './common/EditableInput.vue';

import { defineColorModel, EmitEventNames } from '../composable/colorModel.ts';

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

const tinyColorRef = defineColorModel(props, emit, 'RGBSliders');

const rgb = computed(() => tinyColorRef.value.toRgb());

const alpha = computed(() => tinyColorRef.value.getAlpha());

const redSliderBG = computed(() => getGradient('r', rgb.value));

const greenSliderBG = computed(() => getGradient('g', rgb.value));

const blueSliderBG = computed(() => getGradient('b', rgb.value));

const onChange = (key: 'r' | 'g' | 'b' | 'a', value: number | string) => {
  const v = Number(value);
  tinyColorRef.value = {
    ...rgb.value,
    [key]: v
  }
}

const thumbColor = computed(() => {
  return `#${tinyColorRef.value.toHex()}`;
});

</script>

<style scoped>
.vc-rgb-sliders {
  position: relative;
  width: 100%;
  font-family: Menlo, Consolas, 'Courier New', monospace;
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

.vc-rgb-sliders :deep(.vc-base-slider) {
  /* margin-top = 1/2 * (pickerHeight - sliderHeight) */
  margin-top: 5px;
  height: 14px;
}

.vc-rgb-sliders :deep(.background) {
  border-radius: 4px;
  border: 1px solid var(--vc-input-border);
}

.gradient {
  width: 100%;
  height: 100%;
}

.vc-rgb-sliders :deep(.picker) {
  width: 20px;
  height: 20px;
  margin: 0;
  border-radius: 50%;
  box-shadow: none;
  border: 2px white solid;
  /* translateY: (selfWidth + selfBorder*2) - sliderHight * 1/2  */
  /* translateX: (selfWidth + selfBorder*2) * 1/2  */
  transform: translateX(-12px) translateY(-5px);
}

.slider-wrap:not(.a-slider) :deep(.picker) {
  background-color: v-bind('thumbColor');
}

.vc-rgb-sliders :deep(.vc-editable-input) {
  border-bottom: 1px solid var(--vc-input-border);
}

.vc-rgb-sliders :deep(.vc-input-input) {
  width: 50px;
  background: none;
  color: var(--vc-input-text);
  font-size: 12px;
  text-align: center;
}
</style>
