<template>
  <div role="application" aria-label="Chrome Color Picker" :class="['vc-chrome', disableAlpha ? 'vc-chrome__disable-alpha' : '']">
    <div class="vc-chrome-saturation-wrap">
      <Saturation v-model:tinyColor="tinyColorRef" :hue="retainedHueRef"></Saturation>
    </div>
    <div class="vc-chrome-body">
      <div class="vc-chrome-controls">
        <div class="vc-chrome-color-wrap">
          <div :aria-label="`current color is ${tinyColorRef.toHexString()}`" class="vc-chrome-active-color" :style="{background: activeColor}"></div>
          <Checkerboard v-if="!props.disableAlpha"></Checkerboard>
        </div>

        <div class="vc-chrome-sliders">
          <div class="vc-chrome-hue-wrap">
            <Hue :hue="retainedHueRef" @change="setHue"></Hue>
          </div>
          <div class="vc-chrome-alpha-wrap" v-if="!props.disableAlpha">
            <Alpha v-model:tinyColor="tinyColorRef"></Alpha>
          </div>
        </div>
      </div>

      <div class="vc-chrome-fields-wrap" v-if="!disableFields">
        <div class="vc-chrome-fields" v-show="fieldsIndex === 0">
          <!-- rgba -->
          <div class="vc-chrome-field">
            <EdIn label="r" :value="rgb.r" @change="(v: number) => inputChangeRGBA('r', v)"></EdIn>
          </div>
          <div class="vc-chrome-field">
            <EdIn label="g" :value="rgb.g" @change="(v: number) => inputChangeRGBA('g', v)"></EdIn>
          </div>
          <div class="vc-chrome-field">
            <EdIn label="b" :value="rgb.b" @change="(v: number) => inputChangeRGBA('b', v)"></EdIn>
          </div>
          <div class="vc-chrome-field" v-if="!disableAlpha">
            <EdIn label="a" :value="alpha" :step="0.01" :max="1" @change="(v: number) => inputChangeRGBA('a', v)"></EdIn>
          </div>
        </div>

        <div class="vc-chrome-fields" v-show="fieldsIndex === 1">
          <!-- hex -->
          <div class="vc-chrome-field">
            <EdIn v-if="alpha === 1" label="hex" :value="tinyColorRef.toHexString()" @change="(v: string) => inputChangeHex('hex', v)"></EdIn>
            <EdIn v-if="alpha !== 1" label="hex" :value="tinyColorRef.toHex8String()" @change.hex="(v: string) => inputChangeHex('hex8', v)"></EdIn>
          </div>
        </div>

        <div class="vc-chrome-fields" v-show="fieldsIndex === 2">
          <!-- hsla -->
          <div class="vc-chrome-field">
            <EdIn label="h" :value="retainedHueRef.toFixed()" @change="(v: number) => inputChangeHSLA('h', v)"></EdIn>
          </div>
          <div class="vc-chrome-field">
            <EdIn label="s" :value="hsl.s" @change="(v: number) => inputChangeHSLA('s', v)"></EdIn>
          </div>
          <div class="vc-chrome-field">
            <EdIn label="l" :value="hsl.l" @change="(v: number) => inputChangeHSLA('l', v)"></EdIn>
          </div>
          <div class="vc-chrome-field" v-if="!disableAlpha">
            <EdIn label="a" :value="alpha" :step="0.01" :max="1" @change="(v: number) => inputChangeHSLA('a', v)"></EdIn>
          </div>
        </div>

        <!-- btn -->
        <div class="vc-chrome-toggle-btn" role="button" aria-label="Change another color definition" @click="toggleViews">
          <div class="vc-chrome-toggle-icon">
            <svg style="width:24px; height:24px" viewBox="0 0 24 24"
              @mouseover="showHighlight"
              @mouseenter="showHighlight"
              @mouseout="hideHighlight">
              <path fill="#333" d="M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z" />
            </svg>
          </div>
          <div class="vc-chrome-toggle-icon-highlight" v-show="highlight"></div>
        </div>
        <!-- btn -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import tinycolor from 'tinycolor2';

import Saturation from './common/Saturation.vue';
import Hue from './common/Hue.vue';
import Alpha from './common/Alpha.vue';
import EdIn from './common/EditableInput.vue';
import Checkerboard from './common/Checkerboard.vue';

import { useTinyColorModel, EmitEventNames, type useTinyColorModelProps } from '../composable/vmodel.ts';
import { hueModel } from '../composable/hue.ts';

type Props = {
  disableAlpha?: boolean;
  disableFields?: boolean;
}

const props = defineProps<Props & useTinyColorModelProps>();
const emit = defineEmits(['change'].concat(EmitEventNames));

const { colorRef: tinyColorRef, updateColor: updateTinyColor } = useTinyColorModel(props, emit);
const { hueRef, setHue, retainedHueRef } = hueModel(tinyColorRef, updateTinyColor);

const fieldsIndex = ref(0);
let highlight = ref(false);


const activeColor = computed(() => {
  const rgba = tinyColorRef.value.toRgb();
  return 'rgba(' + [rgba.r, rgba.g, rgba.b, tinyColorRef.value.getAlpha()].join(',') + ')'
});

const hsl = computed(() => {
  const { h, s, l } = tinyColorRef.value.toHsl();
  return {
    h: h.toFixed(),
    s: `${(s * 100).toFixed()}%`,
    l: `${(l * 100).toFixed()}%`
  }
});

const rgb = computed(() => {
  return tinyColorRef.value.toRgb();
});

const alpha = computed(() => {
  return tinyColorRef.value.getAlpha();
});

const inputChangeHex = (type: 'hex' | 'hex8', data?: string) => {
  if (!data) {
    return;
  }
  const newValue = tinycolor(data, { format: type });
  if (newValue.isValid()) {
    if (type === 'hex') {
      newValue.setAlpha(1);
    }
    updateTinyColor(newValue);
  }
};

const inputChangeRGBA = (key: 'r' | 'g' | 'b' | 'a', data?: number) => {
  if (!data || isNaN(Number(data))) {
    return;
  }
  const newValue = {[key]: data};
  updateTinyColor(tinycolor({
    ...rgb.value,
    a: alpha.value,
    ...newValue,
  }));
}

const inputChangeHSLA = (key: 'h' | 's' | 'l' | 'a', data?: string |  number) => {
  if (!data) {
    return;
  }
  const newValue = {[key]: data};
  if (key === 's' || key === 'l'){
    newValue[key] = (+((data as string).replace('%', ''))) / 100;
  }
  if (key === 'h') {
    hueRef.value = +data;
  }
  updateTinyColor(tinycolor({
    ...tinyColorRef.value.toHsl(),
    a: alpha.value,
    ...newValue,
  }));
}

const toggleViews = () =>{
  if (fieldsIndex.value === 2) {
    fieldsIndex.value = 0;
    return;
  }
  fieldsIndex.value ++;
}
const showHighlight = () => {
  highlight.value = true;
}
const hideHighlight = () => {
  highlight.value = false;
}

</script>

<style>
.vc-chrome {
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 0 2px rgba(0,0,0,.3), 0 4px 8px rgba(0,0,0,.3);
  box-sizing: initial;
  width: 225px;
  font-family: Menlo;
  background-color: #fff;
}
.vc-chrome-controls {
  display: flex;
}
.vc-chrome-color-wrap {
  position: relative;
  width: 36px;
}
.vc-chrome-active-color {
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  overflow: hidden;
  z-index: 1;
}
.vc-chrome-color-wrap .vc-checkerboard {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-size: auto;
}
.vc-chrome-sliders {
  flex: 1;
}
.vc-chrome-fields-wrap {
  display: flex;
  padding-top: 16px;
}
.vc-chrome-fields {
  display: flex;
  margin-left: -6px;
  flex: 1;
}
.vc-chrome-field {
  padding-left: 6px;
  width: 100%;
}
.vc-chrome-toggle-btn {
  width: 32px;
  text-align: right;
  position: relative;
}
.vc-chrome-toggle-icon {
  margin-right: -4px;
  margin-top: 12px;
  cursor: pointer;
  position: relative;
  z-index: 2;
}
.vc-chrome-toggle-icon-highlight {
  position: absolute;
  width: 24px;
  height: 28px;
  background: #eee;
  border-radius: 4px;
  top: 10px;
  left: 12px;
}
.vc-chrome-hue-wrap {
  position: relative;
  height: 10px;
  margin-bottom: 8px;
}
.vc-chrome-alpha-wrap {
  position: relative;
  height: 10px;
}
.vc-chrome-hue-wrap .vc-hue {
  border-radius: 2px;
}
.vc-chrome-alpha-wrap .vc-alpha-gradient {
  border-radius: 2px;
}
.vc-chrome-hue-wrap .vc-hue-picker, .vc-chrome-alpha-wrap .vc-alpha-picker {
  width: 12px;
  height: 12px;
  border-radius: 6px;
  transform: translate(-6px, -2px);
  background-color: rgb(248, 248, 248);
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.37);
}
.vc-chrome-body {
  padding: 16px 16px 12px;
  background-color: #fff;
}
.vc-chrome-saturation-wrap {
  width: 100%;
  padding-bottom: 55%;
  position: relative;
  border-radius: 2px 2px 0 0;
  overflow: hidden;
}
.vc-chrome-saturation-wrap .vc-saturation-circle {
  width: 12px;
  height: 12px;
}

.vc-chrome-fields .vc-input__input {
  font-size: 11px;
  color: #333;
  width: 100%;
  border-radius: 2px;
  border: none;
  box-shadow: inset 0 0 0 1px #dadada;
  height: 21px;
  text-align: center;
}
.vc-chrome-fields .vc-input__label {
  text-transform: uppercase;
  font-size: 11px;
  line-height: 11px;
  color: #969696;
  text-align: center;
  display: block;
  margin-top: 12px;
}

.vc-chrome__disable-alpha .vc-chrome-active-color {
  width: 18px;
  height: 18px;
}
.vc-chrome__disable-alpha .vc-chrome-color-wrap {
  width: 30px;
}
.vc-chrome__disable-alpha .vc-chrome-hue-wrap {
  margin-top: 4px;
  margin-bottom: 4px;
}
</style>