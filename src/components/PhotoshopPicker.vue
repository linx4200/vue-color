<template>
  <div role="application" aria-label="PhotoShop color picker" :class="[$style.wrap, disableFields ? $style.disableFields : '']">
    <div :class="$style.title" aria-hidden="true">{{title}}</div>
    <div :class="$style.body">
      <div :class="$style.saturation">
        <Saturation v-model:tinyColor="tinyColorRef" :hue="retainedHueRef"></Saturation>
      </div>
      <div :class="$style.hue">
        <Hue direction="vertical" :hue="retainedHueRef" @change="setHue">
          <div :class="$style.huePointer">
            <i :class="$style.huePointerLeft"></i><i :class="$style.huePointerRight"></i>
          </div>
        </Hue>
      </div>
      <div :class="[[$style.controls], disableFields ? $style.controlsDisableFields : '']">
        <div :class="$style.preview">
          <div :class="$style.previewLabel" aria-hidden="true">{{ newLabel }}</div>
          <div :class="$style.previewSwatches">
            <div :class="$style.previewColor" :aria-label="`New color is #${hex}`" :style="{background: `#${hex}`}"></div>
            <div
              :class="$style.previewColor"
              :style="{background: currentColorRef}"
              @click="clickCurrentColor"
              role="button"
              :aria-label="`Current color is ${currentColorRef}`"
              @keydown.space="clickCurrentColor"
              tabindex="0"
            ></div>
          </div>
          <div :class="$style.previewLabel" aria-hidden="true">{{ currentLabel }}</div>
        </div>
        <div :class="$style.actions" v-if="!disableFields">
          <div :class="$style.actionBtn" role="button" aria-label="Click to apply new color" @click="handleOK" @keydown.space="clickCurrentColor" tabindex="0">{{ okLabel }}</div>
          <div :class="$style.actionBtn" role="button" :aria-label="cancelLabel" @click="handleCancel" @keydown.space="clickCurrentColor" tabindex="0">{{ cancelLabel }}</div>

          <div :class="$style.fields">
            <!-- hsla -->
            <EdIn label="h" desc="°" :value="hsv.h.toFixed()" @change="(v) => inputChangeHSV('h', v)" :a11y="{label: 'Hue'}"></EdIn>
            <EdIn label="s" desc="%" :value="(hsv.s * 100).toFixed()" :min="0" :max="100" @change="(v) => inputChangeHSV('s', v)" :a11y="{label: 'Saturation'}"></EdIn>
            <EdIn label="v" desc="%" :value="(hsv.v * 100).toFixed()" :min="0" :max="100" @change="(v) => inputChangeHSV('v', v)" :a11y="{label: 'Value'}"></EdIn>
            <div :class="$style.fieldsDivider"></div>
            <!-- rgb -->
            <EdIn label="r" :value="rgb.r" @change="(v) => inputChangeRGBA('r', v)" :a11y="{label: 'Red'}"></EdIn>
            <EdIn label="g" :value="rgb.g" @change="(v) => inputChangeRGBA('g', v)" :a11y="{label: 'Green'}"></EdIn>
            <EdIn label="b" :value="rgb.b" @change="(v) => inputChangeRGBA('b', v)" :a11y="{label: 'Blue'}"></EdIn>
            <div :class="$style.fieldsDivider"></div>
            <!-- hex -->
            <EdIn label="#" :class="$style.hex" :value="hex" @change="inputChangeHex" :a11y="{label: 'Hex'}"></EdIn>
          </div>

          <div
            v-if="hasResetButton"
            :class="$style.actionBtn"
            @click="handleReset"
            role="button"
            :aria-label="resetLabel"
            @keydown.space="handleReset"
            tabindex="0"
          >{{ resetLabel }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import tinycolor from 'tinycolor2';

import EdIn from './common/EditableInput.vue';
import Saturation from './common/SaturationSlider.vue';
import Hue from './common/HueSlider.vue';

import { useTinyColorModel, EmitEventNames, type useTinyColorModelProps } from '../composable/vmodel.ts';
import { hueModel } from '../composable/hue.ts';

type Props = {
  title?: string;
  disableFields?: boolean;
  hasResetButton?: boolean;
  okLabel?: string;
  cancelLabel?: string;
  resetLabel?: string;
  newLabel?: string;
  currentLabel?: string;
  currentColor?: string;
}

const props = withDefaults(defineProps<Props & useTinyColorModelProps>(), {
  title: 'Color picker',
  disableFields: false,
  hasResetButton: false,
  okLabel: 'OK',
  cancelLabel: 'Cancel',
  resetLabel: 'Reset',
  newLabel: 'new',
  currentLabel: 'current',
  currentColor: '#fff'
});

const emit = defineEmits(EmitEventNames.concat(['ok', 'cancel', 'reset']));

const { colorRef: tinyColorRef, updateColor: updateTinyColor } = useTinyColorModel(props, emit);
const { hueRef, setHue, retainedHueRef } = hueModel(tinyColorRef, updateTinyColor);

const currentColorRef = ref(props.currentColor);

const hsv = computed(() => tinyColorRef.value.toHsv());
const hex = computed(() => {
  const hex = tinyColorRef.value.toHexString();
  return hex && hex.replace('#', '');
});
const rgb = computed(() => tinyColorRef.value.toRgb());

const clickCurrentColor = () => {
  updateTinyColor(currentColorRef.value);
}

const inputChangeHex = (data?: string) => {
  if (!data) {
    return;
  }
  const newValue = tinycolor(data);
  if (newValue.isValid()) {
    newValue.setAlpha(1);
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

const inputChangeHSV = (key: 'h' | 's' | 'v', data?: string |  number) => {
  if (!data || isNaN(Number(data))) {
    return;
  }
  const newValue = {[key]: Number(data)};
  if (key === 'h') {
    hueRef.value = +data;
  }
  updateTinyColor(tinycolor({
    ...hsv.value,
    ...newValue,
  }));
}

const handleOK = () => {
  emit('ok');
};

const handleCancel = () => {
  emit('cancel');
};

const handleReset = () => {
  emit('reset');
};

</script>

<style module>
.wrap {
  background: #DCDCDC;
  border-radius: 4px;
  box-shadow: 0 0 0 1px rgba(0,0,0,.25), 0 8px 16px rgba(0,0,0,.15);
  box-sizing: initial;
  width: 513px;
  font-family: Roboto;
}
.disableFields {
  width: 390px;
}
.title {
  background-image: linear-gradient(-180deg, #F0F0F0 0%, #D4D4D4 100%);
  border-bottom: 1px solid #B1B1B1;
  box-shadow: inset 0 1px 0 0 rgba(255,255,255,.2), inset 0 -1px 0 0 rgba(0,0,0,.02);
  height: 23px;
  line-height: 24px;
  border-radius: 4px 4px 0 0;
  font-size: 13px;
  color: #4D4D4D;
  text-align: center;
}
.body {
  padding: 15px;
  display: flex;
}
.saturation {
  width: 256px;
  height: 256px;
  position: relative;
  border: 2px solid #B3B3B3;
  border-bottom: 2px solid #F0F0F0;
  overflow: hidden;
}
.saturation :global(.vc-saturation-circle) {
  width: 12px;
  height: 12px;
}
.hue {
  position: relative;
  height: 256px;
  width: 19px;
  margin-left: 10px;
  border: 2px solid #B3B3B3;
  border-bottom: 2px solid #F0F0F0;
}
.huePointer {
  position: relative;
}
.huePointerLeft,
.huePointerRight {
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 5px 0 5px 8px;
  border-color: transparent transparent transparent #555;
}
.huePointerLeft:after,
.huePointerRight:after {
  content: "";
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 4px 0 4px 6px;
  border-color: transparent transparent transparent #fff;
  position: absolute;
  top: 1px;
  left: 1px;
  transform: translate(-8px, -5px);
}
.huePointerLeft {
  transform: translate(-13px, -4px);
}
.huePointerRight {
  transform: translate(20px, -4px) rotate(180deg);
}

.controls {
  width: 180px;
  margin-left: 10px;
  display: flex;
}
.controlsDisableFields {
  width: auto;
}

.actions {
  margin-left: 20px;
  flex: 1;
}
.actionBtn {
  cursor: pointer;
  background-image: linear-gradient(-180deg, #FFFFFF 0%, #E6E6E6 100%);
  border: 1px solid #878787;
  border-radius: 2px;
  height: 20px;
  box-shadow: 0 1px 0 0 #EAEAEA;
  font-size: 14px;
  color: #000;
  line-height: 20px;
  text-align: center;
  margin-bottom: 10px;
}
.preview {
  width: 60px;
}
.previewSwatches {
  border: 1px solid #B3B3B3;
  border-bottom: 1px solid #F0F0F0;
  margin-bottom: 2px;
  margin-top: 1px;
}
.previewColor {
  height: 34px;
  box-shadow: inset 1px 0 0 #000, inset -1px 0 0 #000, inset 0 1px 0 #000;
}
.previewLabel {
  font-size: 14px;
  color: #000;
  text-align: center;
}

.fields {
  padding-top: 5px;
  padding-bottom: 9px;
  width: 80px;
  position: relative;
}
.fields :global(.vc-input-input) {
  margin-left: 40%;
  width: 40%;
  height: 18px;
  border: 1px solid #888888;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.1), 0 1px 0 0 #ECECEC;
  margin-bottom: 5px;
  font-size: 13px;
  padding-left: 3px;
  margin-right: 10px;
}
.fields :global(.vc-input-label), .fields :global(.vc-input-desc) {
  top: 0;
  text-transform: uppercase;
  font-size: 13px;
  height: 18px;
  line-height: 22px;
  position: absolute;
}
.fields :global(.vc-input-label) {
  left: 0;
  width: 34px;
}
.fields :global(.vc-input-desc) {
  right: 0;
  width: 0;
}

.fieldsDivider {
  height: 5px;
}

.hex :global(.vc-input-input) {
  margin-left: 20%;
  width: 80%;
  height: 18px;
  border: 1px solid #888888;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.1), 0 1px 0 0 #ECECEC;
  margin-bottom: 6px;
  font-size: 13px;
  padding-left: 3px;
}
.hex :global(.vc-input-label) {
  position: absolute;
  top: 0;
  left: 0;
  width: 14px;
  text-transform: uppercase;
  font-size: 13px;
  height: 18px;
  line-height: 22px;
}
</style>