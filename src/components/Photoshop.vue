<template>
  <div role="application" aria-label="PhotoShop color picker" :class="['vc-photoshop', disableFields ? 'vc-photoshop__disable-fields' : '']">
    <div role="heading" class="vc-ps-head">{{title}}</div>
    <div class="vc-ps-body">
      <div class="vc-ps-saturation-wrap">
        <Saturation v-model:tinyColor="tinyColorRef" :hue="retainedHueRef"></Saturation>
      </div>
      <div class="vc-ps-hue-wrap">
        <Hue direction="vertical" :hue="retainedHueRef" @change="setHue">
          <div class="vc-ps-hue-pointer">
            <i class="vc-ps-hue-pointer--left"></i><i class="vc-ps-hue-pointer--right"></i>
          </div>
        </Hue>
      </div>
      <div :class="['vc-ps-controls', disableFields ? 'vc-ps-controls__disable-fields' : '']">
        <div class="vc-ps-previews">
          <div class="vc-ps-previews__label">{{ newLabel }}</div>
          <div class="vc-ps-previews__swatches">
            <div class="vc-ps-previews__pr-color" :aria-label="`New color is #${hex}`" :style="{background: `#${hex}`}"></div>
            <div class="vc-ps-previews__pr-color" :aria-label="`Current color is ${currentColorRef}`" :style="{background: currentColorRef}" @click="clickCurrentColor"></div>
          </div>
          <div class="vc-ps-previews__label">{{ currentLabel }}</div>
        </div>
        <div class="vc-ps-actions" v-if="!disableFields">
          <div class="vc-ps-ac-btn" role="button" :aria-label="okLabel" @click="handleOK">{{ okLabel }}</div>
          <div class="vc-ps-ac-btn" role="button" :aria-label="cancelLabel" @click="handleCancel">{{ cancelLabel }}</div>

          <div class="vc-ps-fields">
            <!-- hsla -->
            <EdIn label="h" desc="°" :value="hsv.h.toFixed()" @change="(v) => inputChangeHSV('h', v)"></EdIn>
            <EdIn label="s" desc="%" :value="(hsv.s * 100).toFixed()" :min="0" :max="100" @change="(v) => inputChangeHSV('s', v)"></EdIn>
            <EdIn label="v" desc="%" :value="(hsv.v * 100).toFixed()" :min="0" :max="100" @change="(v) => inputChangeHSV('v', v)"></EdIn>
            <div class="vc-ps-fields__divider"></div>
            <!-- rgb -->
            <EdIn label="r" :value="rgb.r" @change="(v) => inputChangeRGBA('r', v)"></EdIn>
            <EdIn label="g" :value="rgb.g" @change="(v) => inputChangeRGBA('g', v)"></EdIn>
            <EdIn label="b" :value="rgb.b" @change="(v) => inputChangeRGBA('b', v)"></EdIn>
            <div class="vc-ps-fields__divider"></div>
            <!-- hex -->
            <EdIn label="#" class="vc-ps-fields__hex" :value="hex" @change="inputChangeHex"></EdIn>
          </div>

          <div v-if="hasResetButton" class="vc-ps-ac-btn" aria-label="reset" @click="handleReset">{{ resetLabel }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import tinycolor from 'tinycolor2';

import EdIn from './common/EditableInput.vue';
import Saturation from './common/Saturation.vue';
import Hue from './common/Hue.vue';

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
  initialColor?: string;
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
  initialColor: '#fff'
});

const emit = defineEmits(EmitEventNames.concat(['ok', 'cancel', 'reset']));

const { colorRef: tinyColorRef, updateColor: updateTinyColor } = useTinyColorModel(props, emit);
const { hueRef, setHue, retainedHueRef } = hueModel(tinyColorRef, updateTinyColor);

const currentColorRef = ref(props.initialColor);

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

<style>
.vc-photoshop {
  background: #DCDCDC;
  border-radius: 4px;
  box-shadow: 0 0 0 1px rgba(0,0,0,.25), 0 8px 16px rgba(0,0,0,.15);
  box-sizing: initial;
  width: 513px;
  font-family: Roboto;
}
.vc-photoshop__disable-fields {
  width: 390px;
}
.vc-ps-head {
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
.vc-ps-body {
  padding: 15px;
  display: flex;
}

.vc-ps-saturation-wrap {
  width: 256px;
  height: 256px;
  position: relative;
  border: 2px solid #B3B3B3;
  border-bottom: 2px solid #F0F0F0;
  overflow: hidden;
}
.vc-ps-saturation-wrap .vc-saturation-circle {
  width: 12px;
  height: 12px;
}

.vc-ps-hue-wrap {
  position: relative;
  height: 256px;
  width: 19px;
  margin-left: 10px;
  border: 2px solid #B3B3B3;
  border-bottom: 2px solid #F0F0F0;
}
.vc-ps-hue-pointer {
  position: relative;
}
.vc-ps-hue-pointer--left,
.vc-ps-hue-pointer--right {
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 5px 0 5px 8px;
  border-color: transparent transparent transparent #555;
}
.vc-ps-hue-pointer--left:after,
.vc-ps-hue-pointer--right:after {
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
.vc-ps-hue-pointer--left {
  transform: translate(-13px, -4px);
}
.vc-ps-hue-pointer--right {
  transform: translate(20px, -4px) rotate(180deg);
}

.vc-ps-controls {
  width: 180px;
  margin-left: 10px;
  display: flex;
}
.vc-ps-controls__disable-fields {
  width: auto;
}

.vc-ps-actions {
  margin-left: 20px;
  flex: 1;
}
.vc-ps-ac-btn {
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
.vc-ps-previews {
  width: 60px;
}
.vc-ps-previews__swatches {
  border: 1px solid #B3B3B3;
  border-bottom: 1px solid #F0F0F0;
  margin-bottom: 2px;
  margin-top: 1px;
}
.vc-ps-previews__pr-color {
  height: 34px;
  box-shadow: inset 1px 0 0 #000, inset -1px 0 0 #000, inset 0 1px 0 #000;
}
.vc-ps-previews__label {
  font-size: 14px;
  color: #000;
  text-align: center;
}

.vc-ps-fields {
  padding-top: 5px;
  padding-bottom: 9px;
  width: 80px;
  position: relative;
}
.vc-ps-fields .vc-input__input {
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
.vc-ps-fields .vc-input__label, .vc-ps-fields .vc-input__desc {
  top: 0;
  text-transform: uppercase;
  font-size: 13px;
  height: 18px;
  line-height: 22px;
  position: absolute;
}
.vc-ps-fields .vc-input__label {
  left: 0;
  width: 34px;
}
.vc-ps-fields .vc-input__desc {
  right: 0;
  width: 0;
}

.vc-ps-fields__divider {
  height: 5px;
}

.vc-ps-fields__hex .vc-input__input {
  margin-left: 20%;
  width: 80%;
  height: 18px;
  border: 1px solid #888888;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.1), 0 1px 0 0 #ECECEC;
  margin-bottom: 6px;
  font-size: 13px;
  padding-left: 3px;
}
.vc-ps-fields__hex .vc-input__label {
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