<template>
  <div class="vc-twitter" :class="{
    'vc-twitter-hide-triangle ': props.triangle === 'hide',
    'vc-twitter-top-left-triangle ': props.triangle === 'top-left',
    'vc-twitter-top-right-triangle ': props.triangle === 'top-right',
  }" :style="{
      width: typeof props.width === 'number' ? `${props.width}px` : props.width
    }">
    <div class="vc-twitter-triangle-shadow"></div>
    <div class="vc-twitter-triangle"></div>

    <div class="vc-twitter-body">
      <span class="vc-twitter-swatch" :style="{
        background: color,
        boxShadow: `0 0 4px ${equal(color) ? color : 'transparent'}`,
      }" v-for="(color, index) in defaultColors" :key="index" @click="handlerClick(color)">
      </span>
      <div class="vc-twitter-hash">#</div>
      <EdIn label="#" :value="hex.replace('#', '')" @change="inputChange"></EdIn>
      <div class="vc-twitter-clear"></div>
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
  defaultColors?: string[];
  triangle?: 'hide' | 'top-left' | 'top-right';
}

const props = withDefaults(defineProps<useTinyColorModelProps & Props>(), {
  width: 276,
  defaultColors: () => defaultColors,
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

<style>
.vc-twitter {
  background: #fff;
  border: 0 solid rgba(0, 0, 0, 0.25);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  position: relative;
}

.vc-twitter-triangle {
  width: 0px;
  height: 0px;
  border-style: solid;
  border-width: 0 9px 10px 9px;
  border-color: transparent transparent #fff transparent;
  position: absolute;
}

.vc-twitter-triangle-shadow {
  width: 0px;
  height: 0px;
  border-style: solid;
  border-width: 0 9px 10px 9px;
  border-color: transparent transparent rgba(0, 0, 0, .1) transparent;
  position: absolute;
}

.vc-twitter-body {
  padding: 15px 9px 9px 15px;
}

.vc-twitter .vc-editable-input {
  position: relative;
}

.vc-twitter .vc-editable-input input {
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

.vc-twitter .vc-editable-input span {
  display: none;
}

.vc-twitter-hash {
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

.vc-twitter-swatch {
  width: 30px;
  height: 30px;
  float: left;
  border-radius: 4px;
  margin: 0 6px 6px 0;
  cursor: pointer;
  position: relative;
  outline: none;
}

.vc-twitter-clear {
  clear: both;
}

.vc-twitter-hide-triangle .vc-twitter-triangle {
  display: none;
}

.vc-twitter-hide-triangle .vc-twitter-triangle-shadow {
  display: none;
}

.vc-twitter-top-left-triangle .vc-twitter-triangle {
  top: -10px;
  left: 12px;
}

.vc-twitter-top-left-triangle .vc-twitter-triangle-shadow {
  top: -11px;
  left: 12px;
}

.vc-twitter-top-right-triangle .vc-twitter-triangle {
  top: -10px;
  right: 12px;
}

.vc-twitter-top-right-triangle .vc-twitter-triangle-shadow {
  top: -11px;
  right: 12px;
}
</style>
