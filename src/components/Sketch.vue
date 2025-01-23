<template>
  <div role="application" aria-label="Sketch color picker" :class="['vc-sketch', disableAlpha ? 'vc-sketch__disable-alpha' : '']">
    <div class="vc-sketch-saturation-wrap">
      <Saturation :hue="retainedHueRef" v-model:tinyColor="tinyColorRef"></Saturation>
    </div>
    <div class="vc-sketch-controls">
      <div class="vc-sketch-sliders">
        <div class="vc-sketch-hue-wrap">
          <Hue :hue="retainedHueRef" @change="setHue"/>
        </div>
        <div class="vc-sketch-alpha-wrap" v-if="!disableAlpha">
          <Alpha v-model:tinyColor="tinyColorRef"></Alpha>
        </div>
      </div>
      <div class="vc-sketch-color-wrap">
        <div :aria-label="`Current color is ${tinyColorRef.toRgbString()}`" class="vc-sketch-active-color" :style="{background: tinyColorRef.toRgbString()}"></div>
        <Checkerboard />
      </div>
    </div>
    <div class="vc-sketch-field" v-if="!disableFields">
      <!-- rgba -->
      <div class="vc-sketch-field--double">
        <EdIn label="hex" :value="hex" @change="inputChangeHex"></EdIn>
      </div>
      <div class="vc-sketch-field--single">
        <EdIn label="r" :value="rgb.r" @change="(v) => inputChangeRGBA('r', v)"></EdIn>
      </div>
      <div class="vc-sketch-field--single">
        <EdIn label="g" :value="rgb.g" @change="(v) => inputChangeRGBA('g', v)"></EdIn>
      </div>
      <div class="vc-sketch-field--single">
        <EdIn label="b" :value="rgb.b" @change="(v) => inputChangeRGBA('b', v)"></EdIn>
      </div>
      <div class="vc-sketch-field--single" v-if="!disableAlpha">
        <EdIn label="a" :value="alpha" :step="0.01" :max="1" @change="inputChangeAlpha"></EdIn>
      </div>
    </div>
    <div class="vc-sketch-presets" role="group" aria-label="A color preset, pick one to set as current color">
      <template v-for="c in props.presetColors">
        <div
          v-if="!isTransparent(c)"
          class="vc-sketch-presets-color"
          :aria-label="'Color:' + c"
          :key="c + '-color'"
          :style="{background: c}"
          @click="handlePreset(c)">
        </div>
        <div
          v-else
          :key="c"
          :aria-label="'Color:' + c"
          class="vc-sketch-presets-color"
          @click="handlePreset(c)">
          <Checkerboard />
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
const presetColors = [
  '#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321',
  '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2',
  '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF',
  'rgba(0,0,0,0)'
];
</script>

<script setup lang="ts">
import { computed } from 'vue';
import tinycolor from 'tinycolor2';

import EdIn from './common/EditableInput.vue';
import Saturation from './common/Saturation.vue';
import Hue from './common/Hue.vue';
import Alpha from './common/Alpha.vue';
import Checkerboard from './common/Checkerboard.vue';

import { useTinyColorModel, EmitEventNames, type useTinyColorModelProps } from '../composable/vmodel.ts';
import { hueModel } from '../composable/hue.ts';

type Props = {
  presetColors?: string[];
  disableAlpha?: boolean;
  disableFields?: boolean;
}

const props = withDefaults(defineProps<Props & useTinyColorModelProps>(), {
  presetColors: () => presetColors,
  disableAlpha: false,
  disableFields: false
});

const emit = defineEmits(['change'].concat(EmitEventNames));
const { colorRef: tinyColorRef, updateColor: updateTinyColor } = useTinyColorModel(props, emit);
const { setHue, retainedHueRef } = hueModel(tinyColorRef, updateTinyColor);

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
  const newValue = tinycolor(data);
  if (newValue.isValid()) {
    updateTinyColor(newValue);
  }
};

const inputChangeRGBA = (key: 'r' | 'g' | 'b', data?: number) => {
  if (!data || isNaN(Number(data))) {
    return;
  }
  const newValue = {[key]: data};
  updateTinyColor(tinycolor({
    ...rgb.value,
    ...newValue,
  }));
}

const inputChangeAlpha = (data?: number) => {
  if (!data || isNaN(Number(data))) {
    return;
  }
  console.log('=data==>', data);
  updateTinyColor(tinyColorRef.value.setAlpha(data));
}

const handlePreset = (color: string) => {
  updateTinyColor(color);
}

const isTransparent = (color: string) => {
  return tinycolor(color).getAlpha() === 0;
}
</script>

<style>
.vc-sketch {
  position: relative;
  width: 200px;
  padding: 10px 10px 0;
  box-sizing: initial;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, .15), 0 8px 16px rgba(0, 0, 0, .15);
}

.vc-sketch-saturation-wrap {
  width: 100%;
  padding-bottom: 75%;
  position: relative;
  overflow: hidden;
}

.vc-sketch-controls {
  display: flex;
}

.vc-sketch-sliders {
  padding: 4px 0;
  flex: 1;
}

.vc-sketch-sliders .vc-hue,
.vc-sketch-sliders .vc-alpha-gradient {
  border-radius: 2px;
}

.vc-sketch-hue-wrap {
  position: relative;
  height: 10px;
}

.vc-sketch-alpha-wrap {
  position: relative;
  height: 10px;
  margin-top: 4px;
  overflow: hidden;
}

.vc-sketch-color-wrap {
  width: 24px;
  height: 24px;
  position: relative;
  margin-top: 4px;
  margin-left: 4px;
  border-radius: 3px;
}

.vc-sketch-active-color {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 2px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .15), inset 0 0 4px rgba(0, 0, 0, .25);
  z-index: 2;
}

.vc-sketch-color-wrap .vc-checkerboard {
  background-size: auto;
}

.vc-sketch-field {
  display: flex;
  padding-top: 4px;
}

.vc-sketch-field .vc-input__input {
  width: 90%;
  padding: 4px 0 3px 10%;
  border: none;
  box-shadow: inset 0 0 0 1px #ccc;
  font-size: 10px;
}

.vc-sketch-field .vc-input__label {
  display: block;
  text-align: center;
  font-size: 11px;
  color: #222;
  padding-top: 3px;
  padding-bottom: 4px;
  text-transform: capitalize;
}

.vc-sketch-field--single {
  flex: 1;
  padding-left: 6px;
}

.vc-sketch-field--double {
  flex: 2;
}

.vc-sketch-presets {
  margin-right: -10px;
  margin-left: -10px;
  padding-left: 10px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.vc-sketch-presets-color {
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

.vc-sketch-presets-color .vc-checkerboard {
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .15);
  border-radius: 3px;
}

.vc-sketch__disable-alpha .vc-sketch-color-wrap {
  height: 10px;
}
</style>