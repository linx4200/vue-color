<template>
  <div class="vc-hsl-sliders">
    <div class="slider-wrap h-slider">
      <span class="label">H</span>
      <HueSlider :modelValue="hueRef" @update:modelValue="updateHueRef"></HueSlider>
      <EditableInput v-if="!disableFields" :value="Number(hueRef).toFixed()" @change="onHChange" :a11y="{label: 'hue'}" />
    </div>

    <div class="slider-wrap s-slider">
      <span class="label">S</span>
      <BaseSlider
        aria-label="saturation"
        :modelValue="saturation"
        @update:modelValue="onSChange"
      >
        <template #background>
          <div class="gradient" :style="{background: saturationGradient}"></div>
        </template>
      </BaseSlider>
      <EditableInput v-if="!disableFields" :value="saturation.toFixed()" @change="onSChange" :a11y="{label: 'saturation'}" :min="0" :max="100" />
    </div>

    <div class="slider-wrap l-slider">
      <span class="label">L</span>
      <BaseSlider
        aria-label="lightness"
        :modelValue="lightness"
        @update:modelValue="onLChange"
      >
        <template #background>
          <div class="gradient" :style="{background: lightnessGradient}"></div>
        </template>
      </BaseSlider>
      <EditableInput v-if="!disableFields" :value="lightness.toFixed()" @change="onLChange" :a11y="{label: 'lightness'}" :min="0" :max="100" />
    </div>

    <div v-if="!disableAlpha" class="slider-wrap a-slider">
      <span class="label">A</span>
      <AlphaSlider v-model:tinyColor="tinyColorRef"></AlphaSlider>
      <EditableInput v-if="!disableFields" :value="alpha.toFixed(2)" @change="onAlphaChange" :a11y="{label: 'alpha'}" :min="0" :max="1" :step="0.01" />
    </div>
  </div>
</template>

<script lang="ts">
function getSaturationGradient(hue: number, lightness: number) {
  return `linear-gradient(to right,
    hsl(${hue} 0% ${lightness}%),
    hsl(${hue} 50% ${lightness}%),
    hsl(${hue} 100% ${lightness}%)
  )`;
}

function getLightnessGradient(hue: number, saturation: number) {
  return `linear-gradient(to right,
    hsl(${hue} ${saturation}% 0%),
    hsl(${hue} ${saturation}% 10%),
    hsl(${hue} ${saturation}% 20%),
    hsl(${hue} ${saturation}% 30%),
    hsl(${hue} ${saturation}% 40%),
    hsl(${hue} ${saturation}% 50%),
    hsl(${hue} ${saturation}% 60%),
    hsl(${hue} ${saturation}% 70%),
    hsl(${hue} ${saturation}% 80%),
    hsl(${hue} ${saturation}% 90%),
    hsl(${hue} ${saturation}% 100%)
  )`;
}
</script>

<script setup lang="ts">
import tinycolor from 'tinycolor2';
import { computed, ref, watch } from 'vue';

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

const tinyColorRef = defineColorModel(props, emit, 'HSLSliders');

const { hueRef, updateHueRef } = useHueRef(tinyColorRef);

const hsl = computed(() => {
  const value = tinyColorRef.value.toHsl();
  return value;
});
const alpha = computed(() => tinyColorRef.value.getAlpha());

// Hold saturation and lightness internally in case tinycolor drops them
const saturation = ref(hsl.value.s * 100);
const lightness = ref(hsl.value.l * 100);

watch(hsl, () => {
  saturation.value = hsl.value.s * 100;
  lightness.value = hsl.value.l * 100;
});

const onHChange = (value?: string) => {
  if (!value) {
    return;
  }
  updateHueRef(Number(value));
}

const onSChange = (value: number | string) => {
  const s = Number(value);
  saturation.value = s;
  tinyColorRef.value = {
    ...hsl.value,
    s: s / 100
  }
}

const onLChange = (value: number | string) => {
  const l = Number(value);
  lightness.value = l;
  tinyColorRef.value = {
    ...hsl.value,
    l: l / 100
  }
}

const onAlphaChange = (value: number | string) => {
  const a = Number(value);
  tinyColorRef.value = {
    ...hsl.value,
    a
  }
}

const saturationGradient = computed(() =>
  getSaturationGradient(hueRef.value, lightness.value)
);

const lightnessGradient = computed(() =>
  getLightnessGradient(hueRef.value, saturation.value)
);

const thumbColorForH = computed(() => {
  return `hsl(${hueRef.value}, 100%, 50%)`;
});

const thumbColor = computed(() => {
  return `hsl(${hueRef.value}, ${saturation.value}%, ${lightness.value}%)`;
});

// const thumbColorForAlpha = computed(() => {
//   return tinyColorRef.value.toRgbString();
// });

</script>

<style scoped>
.vc-hsl-sliders {
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

.vc-hsl-sliders :deep(.vc-base-slider) {
  /* margin-top = 1/2 * (pickerHeight - sliderHeight) */
  margin-top: 5px;
  height: 14px;
}

.vc-hsl-sliders :deep(.background) {
  border-radius: 4px;
  border: 1px solid var(--vc-input-border);
}

.gradient {
  width: 100%;
  height: 100%;
}

.vc-hsl-sliders :deep(.picker) {
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

.h-slider :deep(.picker) {
  background-color: v-bind('thumbColorForH');
}

.s-slider :deep(.picker), .l-slider :deep(.picker) {
  background-color: v-bind('thumbColor');
}

/* .a-slider :deep(.picker) {
  background-color: v-bind('thumbColorForAlpha');
} */

.vc-hsl-sliders :deep(.vc-editable-input) {
  border-bottom: 1px solid var(--vc-input-border);
}

.vc-hsl-sliders :deep(.vc-input-input) {
  width: 50px;
  background: none;
  color: var(--vc-input-text);
  font-size: 12px;
  text-align: center;
}
</style>
