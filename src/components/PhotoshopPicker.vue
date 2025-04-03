<template>
  <div role="application" aria-label="PhotoShop color picker" :class="['vc-photoshop-picker', disableFields ? 'fields_disabled' : '']">
    <div class="title" aria-hidden="true">{{title}}</div>
    <div class="body">
      <div class="saturation">
        <Saturation v-model:tinyColor="tinyColorRef" :hue="hueRef"></Saturation>
      </div>
      <div class="hue">
        <Hue direction="vertical" :modelValue="hueRef" @update:modelValue="updateHueRef">
          <div class="hue-picker">
            <i class="hue-picker-left"></i><i class="hue-picker-right"></i>
          </div>
        </Hue>
      </div>
      <div :class="['controls', disableFields ? 'controls_fields_disabled' : '']">
        <div class="preview">
          <div class="preview-label" aria-hidden="true">{{ newLabel }}</div>
          <div class="preview-swatches">
            <div class="preview-color" :aria-label="`New color is #${hex}`" :style="{background: `#${hex}`}"></div>
            <div
              class="preview-color"
              :style="{background: currentColorRef}"
              @click="clickCurrentColor"
              role="button"
              :aria-label="`Current color is ${currentColorRef}`"
              @keydown.space="clickCurrentColor"
              tabindex="0"
            ></div>
          </div>
          <div class="preview-label" aria-hidden="true">{{ currentLabel }}</div>
        </div>
        <div class="actions" v-if="!disableFields">
          <div class="action-btn" role="button" aria-label="Click to apply new color" @click="handleOK" @keydown.space="clickCurrentColor" tabindex="0">{{ okLabel }}</div>
          <div class="action-btn" role="button" :aria-label="cancelLabel" @click="handleCancel" @keydown.space="clickCurrentColor" tabindex="0">{{ cancelLabel }}</div>

          <div class="fields">
            <!-- hsla -->
            <EdIn label="h" desc="°" :value="hsv.h.toFixed()" @change="(v) => inputChangeHSV('h', v)" :a11y="{label: 'Hue'}"></EdIn>
            <EdIn label="s" desc="%" :value="(hsv.s * 100).toFixed()" :min="0" :max="100" @change="(v) => inputChangeHSV('s', v)" :a11y="{label: 'Saturation'}"></EdIn>
            <EdIn label="v" desc="%" :value="(hsv.v * 100).toFixed()" :min="0" :max="100" @change="(v) => inputChangeHSV('v', v)" :a11y="{label: 'Value'}"></EdIn>
            <div class="fields-divider"></div>
            <!-- rgb -->
            <EdIn label="r" :value="rgb.r" @change="(v) => inputChangeRGBA('r', v)" :a11y="{label: 'Red'}"></EdIn>
            <EdIn label="g" :value="rgb.g" @change="(v) => inputChangeRGBA('g', v)" :a11y="{label: 'Green'}"></EdIn>
            <EdIn label="b" :value="rgb.b" @change="(v) => inputChangeRGBA('b', v)" :a11y="{label: 'Blue'}"></EdIn>
            <div class="fields-divider"></div>
            <!-- hex -->
            <EdIn label="#" class="hex" :value="hex" @change="inputChangeHex" :a11y="{label: 'Hex'}"></EdIn>
          </div>

          <div
            v-if="hasResetButton"
            class="action-btn"
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
import EdIn from './common/EditableInput.vue';
import Saturation from './common/SaturationSlider.vue';
import Hue from './common/HueSlider.vue';

import { defineColorModel, EmitEventNames, type useTinyColorModelProps } from '../composable/colorModel.ts';
import { useHueRef } from '../composable/hue.ts';

import { isValid } from '../utils/color';

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

const tinyColorRef = defineColorModel(props, emit);
const { hueRef, updateHueRef } = useHueRef(tinyColorRef);

const currentColorRef = ref(props.currentColor);

const hsv = computed(() => tinyColorRef.value.toHsv());
const hex = computed(() => {
  const hex = tinyColorRef.value.toHexString();
  return hex && hex.replace('#', '');
});
const rgb = computed(() => tinyColorRef.value.toRgb());

const clickCurrentColor = () => {
  tinyColorRef.value = currentColorRef.value;
}

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

const inputChangeHSV = (key: 'h' | 's' | 'v', data?: string |  number) => {
  if (!data || isNaN(Number(data))) {
    return;
  }
  const newValue = {[key]: Number(data)};
  tinyColorRef.value = {
    ...hsv.value,
    ...newValue,
  };
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

<style scoped>
.vc-photoshop-picker {
  background: #DCDCDC;
  border-radius: 4px;
  box-shadow: 0 0 0 1px rgba(0,0,0,.25), 0 8px 16px rgba(0,0,0,.15);
  box-sizing: initial;
  width: 513px;
  font-family: Roboto;
}
.fields_disabled {
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
.saturation :deep(.picker) {
  width: 12px;
  height: 12px;
  transform: translate(-6px, -6px);
}
.hue {
  position: relative;
  height: 256px;
  width: 19px;
  margin-left: 10px;
  border: 2px solid #B3B3B3;
  border-bottom: 2px solid #F0F0F0;
}
.hue-picker {
  position: relative;
}
.hue-picker-left,
.hue-picker-right {
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 5px 0 5px 8px;
  border-color: transparent transparent transparent #555;
  cursor: pointer;
}
.hue-picker-left:after,
.hue-picker-right:after {
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
.hue-picker-left {
  transform: translate(-10px, -4px);
}
.hue-picker-right {
  transform: translate(21px, -4px) rotate(180deg);
}

.controls {
  width: 180px;
  margin-left: 10px;
  display: flex;
}
.controls_fields_disabled {
  width: auto;
}

.actions {
  margin-left: 20px;
  flex: 1;
}
.action-btn {
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
.preview-swatches {
  border: 1px solid #B3B3B3;
  border-bottom: 1px solid #F0F0F0;
  margin-bottom: 2px;
  margin-top: 1px;
}
.preview-color {
  height: 34px;
  box-shadow: inset 1px 0 0 #000, inset -1px 0 0 #000, inset 0 1px 0 #000;
}
.preview-label {
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
.fields :deep(.vc-input-input) {
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
.fields :deep(.vc-input-label), .fields :deep(.vc-input-desc) {
  top: 0;
  text-transform: uppercase;
  font-size: 13px;
  height: 18px;
  line-height: 22px;
  position: absolute;
}
.fields :deep(.vc-input-label) {
  left: 0;
  width: 34px;
}
.fields :deep(.vc-input-desc) {
  right: 0;
  width: 0;
}

.fields-divider {
  height: 5px;
}

.hex :deep(.vc-input-input) {
  margin-left: 20%;
  width: 80%;
  height: 18px;
  border: 1px solid #888888;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.1), 0 1px 0 0 #ECECEC;
  margin-bottom: 6px;
  font-size: 13px;
  padding-left: 3px;
}
.hex :deep(.vc-input-label) {
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