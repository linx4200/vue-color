<template>
  <div role="application" aria-label="Chrome Color Picker" :class="['vc-chrome-picker', disableAlpha ? 'alpha-disabled' : '']">
    <div class="saturation">
      <Saturation v-model:tinyColor="tinyColorRef" :hue="hueRef"></Saturation>
    </div>
    <div class="body">
      <div class="controls">
        <div class="color-wrap">
          <div
            class="active-color"
            :style="{backgroundColor: activeColor}"
            role="presentation"
            aria-live="polite"
            :aria-label="`Current color is ${activeColor}`"
          ></div>
          <Checkerboard v-if="!props.disableAlpha"></Checkerboard>
        </div>

        <div class="sliders">
          <div class="hue-wrap">
            <Hue :modelValue="hueRef" @update:modelValue="updateHueRef"></Hue>
          </div>
          <div class="alpha-wrap" v-if="!props.disableAlpha">
            <Alpha v-model:tinyColor="tinyColorRef"></Alpha>
          </div>
        </div>
      </div>

      <div class="fieldsWrap" v-if="showFields" data-testid="fields">
        <div class="fields" v-show="fieldsIndex === getFormatIndex('rgb')" v-if="isSupportedFormat('rgb')">
          <!-- rgba -->
          <div class="field">
            <EdIn label="r" :value="rgb.r" @change="(v: number) => inputChangeRGBA('r', v)" :a11y="{label: 'Red'}"></EdIn>
          </div>
          <div class="field">
            <EdIn label="g" :value="rgb.g" @change="(v: number) => inputChangeRGBA('g', v)" :a11y="{label: 'Green'}"></EdIn>
          </div>
          <div class="field">
            <EdIn label="b" :value="rgb.b" @change="(v: number) => inputChangeRGBA('b', v)" :a11y="{label: 'Blue'}"></EdIn>
          </div>
          <div class="field" v-if="!disableAlpha">
            <EdIn label="a" :value="alpha" :step="0.01" :max="1" @change="(v: number) => inputChangeRGBA('a', v)" :a11y="{label: 'Transparency'}"></EdIn>
          </div>
        </div>

        <div class="fields" v-show="fieldsIndex === getFormatIndex('hex')" v-if="isSupportedFormat('hex')">
          <!-- hex -->
          <div class="field">
            <EdIn v-if="alpha === 1" label="hex" :value="tinyColorRef.toHexString()" @change="inputChangeHex" :a11y="{label: 'Hex'}"></EdIn>
            <EdIn v-if="alpha !== 1" label="hex" :value="tinyColorRef.toHex8String()" @change="inputChangeHex" :a11y="{label: 'Hex with transparency'}"></EdIn>
          </div>
        </div>

        <div class="fields" v-show="fieldsIndex === getFormatIndex('hsl')" v-if="isSupportedFormat('hsl')">
          <!-- hsla -->
          <div class="field">
            <EdIn label="h" :value="hueRef.toFixed()" @change="(v: number) => inputChangeHSLA('h', v)" :a11y="{label: 'Hue'}"></EdIn>
          </div>
          <div class="field">
            <EdIn label="s" :value="hsl.s" @change="(v: number) => inputChangeHSLA('s', v)" :a11y="{label: 'Saturation'}"></EdIn>
          </div>
          <div class="field">
            <EdIn label="l" :value="hsl.l" @change="(v: number) => inputChangeHSLA('l', v)" :a11y="{label: 'Lightness'}"></EdIn>
          </div>
          <div class="field" v-if="!disableAlpha">
            <EdIn label="a" :value="alpha" :step="0.01" :max="1" @change="(v: number) => inputChangeHSLA('a', v)" :a11y="{label: 'Transparency'}"></EdIn>
          </div>
        </div>

        <!-- btn -->
        <div
          v-if="normalizedFormats.length > 1"
          class="toggle-btn"
          @click="toggleViews"
          @keydown.enter="toggleViews"
          @keydown.space="toggleViews"
          @mouseover="showHighlight"
          @mouseenter="showHighlight"
          @mouseout="hideHighlight"
          @focus="showHighlight"
          @blur="hideHighlight"
          role="button"
          aria-label="Change color format"
          tabindex="0"
        >
          <div class="toggle-icon" role="presentation">
            <svg
              style="width:24px; height:24px"
              viewBox="0 0 24 24"
            >
              <path fill="#333" d="M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z" />
            </svg>
          </div>
          <div class="toggle-icon_highlighted" v-show="highlight" role="presentation"></div>
        </div>
        <!-- btn -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import Saturation from './common/SaturationSlider.vue';
import Hue from './common/HueSlider.vue';
import Alpha from './common/AlphaSlider.vue';
import EdIn from './common/EditableInput.vue';
import Checkerboard from './common/CheckerboardBG.vue';

import { defineColorModel, EmitEventNames, type useTinyColorModelProps } from '../composable/colorModel.ts';
import { useHueRef } from '../composable/hue.ts';

import { isValid } from '../utils/color';

type Format = 'hex' | 'rgb' | 'hsl';
type Props = {
  disableAlpha?: boolean;
  disableFields?: boolean;
  /**
   * An array of color format options used to control the display of the format field.
   *
   * Determines both the **order** in which the format options appear and whether a format is **included or hidden**.
   * Only supports `'hex'`, `'hsl'`, and `'rgb'`. Duplicate or invalid values will be ignored at runtime.
   *
   * @default ['rgb', 'hex', 'hsl']
   */
  formats?: Array<Format>;
}

const props = withDefaults(defineProps<Props & useTinyColorModelProps>(), {
  formats: () => ['rgb', 'hex', 'hsl']
});

const emit = defineEmits(['change'].concat(EmitEventNames));

const tinyColorRef = defineColorModel(props, emit);

const { hueRef, updateHueRef } = useHueRef(tinyColorRef);

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

const VALID_FORMATS: Set<Format> = new Set(['hex', 'hsl', 'rgb']);
const normalizedFormats = computed(() => {
  const seen = new Set<Format>();
  const result: Format[] = [];
  const formats = props.formats;

  for (const format of formats) {
    if (VALID_FORMATS.has(format as Format)) {
      const f = format as Format;
      if (!seen.has(f)) {
        seen.add(f);
        result.push(f);
      }
    }
  }
  return result;
});

const showFields = computed(() => {
  const { disableFields, formats } = props;
  if (disableFields === true) {
    return false;
  }
  if (!Array.isArray(formats)) {
    return false;
  }
  const l = normalizedFormats.value.length;
  if (l === 0) {
    return false;
  }
  return true;
});

const isSupportedFormat = (format: Format) => {
  return normalizedFormats.value.includes(format);
}

const getFormatIndex = (format: Format) => {
  return normalizedFormats.value.indexOf(format);
}

const inputChangeHex = (data?: string) => {
  if (!data) {
    return;
  }
  if (isValid(data)) {
    tinyColorRef.value = data;
  }
};

const inputChangeRGBA = (key: 'r' | 'g' | 'b' | 'a', data?: number) => {
  if (!data || isNaN(Number(data))) {
    return;
  }
  const newValue = {[key]: data};
  tinyColorRef.value = {
    ...rgb.value,
    a: alpha.value,
    ...newValue,
  };
}

const inputChangeHSLA = (key: 'h' | 's' | 'l' | 'a', data?: string |  number) => {
  if (!data) {
    return;
  }
  const newValue = {[key]: +data};
  if (key === 's' || key === 'l'){
    newValue[key] = (+((data as string).replace('%', ''))) / 100;
  }
  tinyColorRef.value = {
    ...tinyColorRef.value.toHsl(),
    a: alpha.value,
    ...newValue,
  };
}

const toggleViews = () => {
  if (fieldsIndex.value === normalizedFormats.value.length - 1) {
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

<style scoped>
.vc-chrome-picker {
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 0 2px rgba(0,0,0,.3), 0 4px 8px rgba(0,0,0,.3);
  box-sizing: initial;
  width: 225px;
  font-family: Menlo, Consolas, 'Courier New', monospace;
  background-color: #fff;
}
.controls {
  display: flex;
}
.color-wrap {
  position: relative;
  width: 36px;
}
.active-color {
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  overflow: hidden;
  z-index: 1;
}
.color-wrap :deep(.vc-checkerboard) {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-size: auto;
}
.sliders {
  flex: 1;
}
.fieldsWrap {
  display: flex;
  padding-top: 16px;
}
.fields {
  display: flex;
  margin-left: -6px;
  flex: 1;
}
.field {
  padding-left: 6px;
  width: 100%;
}
.toggle-btn {
  width: 32px;
  text-align: right;
  position: relative;
}
.toggle-icon {
  margin-right: -4px;
  margin-top: 12px;
  cursor: pointer;
  position: relative;
  z-index: 2;
}
.toggle-icon_highlighted {
  position: absolute;
  width: 24px;
  height: 28px;
  background: #eee;
  border-radius: 4px;
  top: 10px;
  left: 12px;
}
.hue-wrap {
  position: relative;
  height: 10px;
  margin-bottom: 8px;
}
.alpha-wrap {
  position: relative;
  height: 10px;
}
.hue-wrap :deep(.container) {
  border-radius: 2px;
}
.alpha-wrap :deep(.gradient) {
  border-radius: 2px;
}
.hue-wrap :deep(.picker), .alpha-wrap :deep(.picker) {
  width: 12px;
  height: 12px;
  border-radius: 6px;
  transform: translate(-6px, -2px);
  background-color: rgb(248, 248, 248);
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.37);
}
.body {
  padding: 16px 16px 12px;
  background-color: #fff;
}

.saturation {
  width: 100%;
  padding-bottom: 55%;
  position: relative;
  border-radius: 2px 2px 0 0;
  overflow: hidden;
}
.saturation :deep(.picker) {
  width: 12px;
  height: 12px;
  transform: translate(-6px, -6px);
}

.fields :deep(.vc-input-input) {
  font-size: 11px;
  color: #333;
  width: 100%;
  border-radius: 2px;
  border: none;
  box-shadow: inset 0 0 0 1px #dadada;
  height: 21px;
  text-align: center;
}
.fields :deep(.vc-input-label) {
  text-transform: uppercase;
  font-size: 11px;
  line-height: 11px;
  color: #969696;
  text-align: center;
  display: block;
  margin-top: 12px;
}

.alpha-disabled :deep(.active-color) {
  width: 18px;
  height: 18px;
}
.alpha-disabled :deep(.color-wrap) {
  width: 30px;
}
.alpha-disabled :deep(.hue-wrap) {
  margin-top: 4px;
  margin-bottom: 4px;
}
</style>