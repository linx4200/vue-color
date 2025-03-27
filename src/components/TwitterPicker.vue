<template>
  <div
    :class="['vc-twitter-picker', {
      'tri_hide': props.triangle === 'hide',
      'tri_top_left': props.triangle === 'top-left',
      'tri_top_right': props.triangle === 'top-right',
    }]"
    :style="{
      width: typeof props.width === 'number' ? `${props.width}px` : props.width
    }"
    role="application"
    aria-label="Twitter color picker"
  >
    <div class="triangle_shadow"></div>
    <div class="triangle"></div>

    <div class="body" role="listbox" tabindex="0" aria-label="Select a color">
      <span
        v-for="(color, index) in presetColors"
        :key="index"
        class="swatch"
          :style="{
          background: color,
          boxShadow: `0 0 4px ${equal(color) ? color : 'transparent'}`,
        }"
        @click="handlerClick(color)"
        role="option"
        :aria-label="'color:' + color"
        :aria-selected="equal(color)"
        @keydown.space="handlerClick(color)"
        tabindex="0"
      >
      </span>
      <div class="hash" aria-hidden="true">#</div>
      <EdIn :value="hex.replace('#', '')" @change="inputChange" :a11y="{label: 'Hex'}"></EdIn>
      <div class="clear"></div>
    </div>
  </div>
</template>

<script lang="ts">
const defaultColors = [
  '#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3',
  '#EB144C', '#F78DA7', '#9900EF'
]
</script>

<script setup lang="ts">
import EdIn from './common/EditableInput.vue';
import { useTinyColorModel, EmitEventNames ,type useTinyColorModelProps } from '../composable/vmodel';
import { computed } from 'vue';
import tinycolor from 'tinycolor2';

type Props = {
  width?: number | string;
  presetColors?: string[];
  triangle?: 'hide' | 'top-left' | 'top-right';
}

const props = withDefaults(defineProps<useTinyColorModelProps & Props>(), {
  width: 276,
  presetColors: () => defaultColors,
  triangle: 'top-left'
});
const emit = defineEmits(EmitEventNames);

const { colorRef: tinyColorRef, updateColor: updateTinyColor } = useTinyColorModel(props, emit);

const hex = computed(()=>tinyColorRef.value.toHexString());

const equal = (color: string) => {
  return color.toLowerCase() === hex.value.toLowerCase();
}

const handlerClick = (color: string) => {
  updateTinyColor(color);
}

const inputChange = (hex: string) => {
  const color = tinycolor(`${hex}`);
  if (color.isValid()) {
    updateTinyColor(color);
  }
}
</script>

<style scoped>
.vc-twitter-picker {
  background: #fff;
  border: 0 solid rgba(0, 0, 0, 0.25);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  position: relative;
}

.triangle {
  width: 0px;
  height: 0px;
  border-style: solid;
  border-width: 0 9px 10px 9px;
  border-color: transparent transparent #fff transparent;
  position: absolute;
}

.triangle_shadow {
  width: 0px;
  height: 0px;
  border-style: solid;
  border-width: 0 9px 10px 9px;
  border-color: transparent transparent rgba(0, 0, 0, .1) transparent;
  position: absolute;
}

.body {
  padding: 15px 9px 9px 15px;
}

.vc-twitter-picker :deep(.vc-editable-input) {
  position: relative;
}

.vc-twitter-picker :deep(.vc-input-input) {
  width: 100px;
  font-size: 14px;
  color: #666;
  border: 0px;
  outline: none;
  height: 28px;
  box-shadow: inset 0 0 0 1px #F0F0F0;
  box-sizing: content-box;
  border-radius: 0 4px 4px 0;
  float: left;
  padding: 1px;
  padding-left: 8px;
}

.vc-twitter-picker :deep(.vc-editable-input) span {
  display: none;
}

.hash {
  background: #F0F0F0;
  height: 30px;
  width: 30px;
  border-radius: 4px 0 0 4px;
  float: left;
  color: #98A1A4;
  display: flex;
  align-items: center;
  justify-content: center;
}

.swatch {
  width: 30px;
  height: 30px;
  float: left;
  border-radius: 4px;
  margin: 0 6px 6px 0;
  cursor: pointer;
  position: relative;
  outline: none;
}

.clear {
  clear: both;
}

.tri_hide .triangle {
  display: none;
}

.tri_hide .triangle_shadow {
  display: none;
}

.tri_top_left .triangle {
  top: -10px;
  left: 12px;
}

.tri_top_left .triangle_shadow {
  top: -11px;
  left: 12px;
}

.tri_top_right .triangle {
  top: -10px;
  right: 12px;
}

.tri_top_right .triangle_shadow {
  top: -11px;
  right: 12px;
}
</style>
