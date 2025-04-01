<template>
  <div role="application" aria-label="Sketch color picker" :class="['vc-sketch-picker', disableAlpha ? 'alpha-disabled' : '']">
    <div class="saturation">
      <Saturation :hue="hueRef" v-model:tinyColor="tinyColorRef"></Saturation>
    </div>
    <div class="controls">
      <div class="sliders">
        <div class="hue">
          <Hue v-model="hueRef" />
        </div>
        <div class="alpha" v-if="!disableAlpha">
          <Alpha v-model:tinyColor="tinyColorRef"></Alpha>
        </div>
      </div>
      <div class="color">
        <div :aria-label="`Current color is ${tinyColorRef.toRgbString()}`" class="active-color" :style="{background: tinyColorRef.toRgbString()}"></div>
        <Checkerboard />
      </div>
    </div>
    <div class="field" v-if="!disableFields">
      <!-- rgba -->
      <div class="field_double">
        <EdIn label="hex" :value="hex" @change="inputChangeHex" :a11y="{label: 'Hex'}"></EdIn>
      </div>
      <div class="field_single">
        <EdIn label="r" :value="rgb.r" @change="(v) => inputChangeRGBA('r', v)" :a11y="{label: 'Red'}"></EdIn>
      </div>
      <div class="field_single">
        <EdIn label="g" :value="rgb.g" @change="(v) => inputChangeRGBA('g', v)" :a11y="{label: 'Green'}"></EdIn>
      </div>
      <div class="field_single">
        <EdIn label="b" :value="rgb.b" @change="(v) => inputChangeRGBA('b', v)" :a11y="{label: 'Blue'}"></EdIn>
      </div>
      <div class="field_single" v-if="!disableAlpha">
        <EdIn label="a" :value="alpha" :step="0.01" :max="1" @change="inputChangeAlpha" :a11y="{label: 'Transparency'}"></EdIn>
      </div>
    </div>
    <div class="presets" role="listbox" aria-label="A color preset, pick one to set as current color">
      <template v-for="c in props.presetColors">
        <div
          v-if="!isTransparent(c)"
          class="preset-color"
          :key="c + '-color'"
          :style="{background: c}"
          @click="handlePreset(c)"
          :aria-label="'Color:' + c"
          :aria-selected="`#${hex.toLowerCase()}` === c.toLowerCase()"
          role="option"
          tabindex="0"
          @keydown.space="handlePreset(c)"
          ></div>
        <div
          v-else
          :key="c"
          class="preset-color"
          @click="handlePreset(c)"
          aria-label="Color: transparency"
          :aria-selected="alpha === 0"
          role="option"
          tabindex="0"
          @keydown.space="handlePreset(c)">
          <Checkerboard />
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
const presetColorsOfSketch = [
  '#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321',
  '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2',
  '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF',
  'rgba(0,0,0,0)'
];
</script>

<script setup lang="ts">
import { computed } from 'vue';

import EdIn from './common/EditableInput.vue';
import Saturation from './common/SaturationSlider.vue';
import Hue from './common/HueSlider.vue';
import Alpha from './common/AlphaSlider.vue';
import Checkerboard from './common/CheckerboardBG.vue';

import { defineColorModel, EmitEventNames, type useTinyColorModelProps } from '../composable/colorModel.ts';
import { retainedHueRef } from '../composable/hue.ts';

import { isValid, isTransparent } from '../utils/color';

type Props = {
  presetColors?: string[];
  disableAlpha?: boolean;
  disableFields?: boolean;
}

const props = withDefaults(defineProps<Props & useTinyColorModelProps>(), {
  presetColors: () => presetColorsOfSketch,
  disableAlpha: false,
  disableFields: false
});

const emit = defineEmits(['change'].concat(EmitEventNames));
const tinyColorRef = defineColorModel(props, emit);
const hueRef = retainedHueRef({ colorRef: tinyColorRef });

const alpha = computed(() => tinyColorRef.value.getAlpha());
const hex = computed(() => {
  let hex;
  if (alpha.value < 1) {
    hex = tinyColorRef.value.toHex8String();
  } else {
    hex = tinyColorRef.value.toHexString();
  }
  return hex.replace('#', '')
});
const rgb = computed(() => tinyColorRef.value.toRgb());

const inputChangeHex = (data?: string) => {
  if (!data) {
    return;
  }
  if (isValid(data)) {
    tinyColorRef.value = data;
  }
};

const inputChangeRGBA = (key: 'r' | 'g' | 'b', data?: number) => {
  if (!data || isNaN(Number(data))) {
    return;
  }
  const newValue = {[key]: data};
  tinyColorRef.value = {
    ...rgb.value,
    ...newValue,
  };
}

const inputChangeAlpha = (data?: number) => {
  if (!data || isNaN(Number(data))) {
    return;
  }
  tinyColorRef.value = tinyColorRef.value.setAlpha(data).clone();
}

const handlePreset = (color: string) => {
  tinyColorRef.value = color;
}
</script>

<style scoped>
.vc-sketch-picker {
  position: relative;
  width: 200px;
  padding: 10px 10px 0;
  box-sizing: initial;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, .15), 0 8px 16px rgba(0, 0, 0, .15);
}

.saturation {
  width: 100%;
  padding-bottom: 75%;
  position: relative;
  overflow: hidden;
}

.controls {
  display: flex;
}

.sliders {
  padding: 4px 0;
  flex: 1;
}

.hue :deep(.container),
.alpha :deep(.gradient) {
  border-radius: 2px;
}

.hue {
  position: relative;
  height: 10px;
}

.alpha {
  position: relative;
  height: 10px;
  margin-top: 4px;
  overflow: hidden;
}

.color {
  width: 24px;
  height: 24px;
  position: relative;
  margin-top: 4px;
  margin-left: 4px;
  border-radius: 3px;
}

.active-color {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 2px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .15), inset 0 0 4px rgba(0, 0, 0, .25);
  z-index: 2;
}

.color :deep(.vc-checkerboard) {
  background-size: auto;
}

.field {
  display: flex;
  padding-top: 4px;
}

.field :deep(.vc-input-input) {
  width: 90%;
  padding: 4px 0 3px 10%;
  border: none;
  box-shadow: inset 0 0 0 1px #ccc;
  font-size: 10px;
}

.field :deep(.vc-input-label) {
  display: block;
  text-align: center;
  font-size: 11px;
  color: #222;
  padding-top: 3px;
  padding-bottom: 4px;
}

.field_single {
  flex: 1;
  padding-left: 6px;
}

.field_double {
  flex: 2;
}

.presets {
  margin-right: -10px;
  margin-left: -10px;
  padding-left: 10px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.preset-color {
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  display: inline-block;
  margin: 0 10px 10px 0;
  vertical-align: top;
  cursor: pointer;
  width: 16px;
  height: 16px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .15);
}

.preset-color :deep(.vc-checkerboard) {
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .15);
  border-radius: 3px;
}

.alpha-disabled .color {
  height: 10px;
}
</style>