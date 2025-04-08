<script setup lang="ts">
import { watch, computed, reactive } from 'vue';

import {
  ChromePicker,
  SketchPicker,
  PhotoshopPicker,
  CompactPicker,
  GrayscalePicker,
  MaterialPicker,
  SliderPicker,
  TwitterPicker,
  SwatchesPicker,
  HueSlider,
  tinycolor
// } from '../dist/vue-color.js';
} from '../src';

// import '../dist/vue-color.css'

const tinyColor = defineModel('tinycolor', {
  default: tinycolor('#F5F7FA')
});

const color = defineModel({
  default: () => reactive({r: 0, g: 0, b: 255, a: 1})
});

watch(tinyColor, () => console.log('color changed ==>', tinyColor.value));

function invertColor(rgb: { r: number; g: number; b: number }): string {
  const inverted = {
    r: 255 - rgb.r,
    g: 255 - rgb.g,
    b: 255 - rgb.b
  };
  return `rgb(${inverted.r}, ${inverted.g}, ${inverted.b})`;
}

const hex = computed(() => {
  return tinycolor(tinyColor.value).toHex8String();
});

const background = computed(() => {
  return {'background-color': hex.value}
});

const hsva = computed(() => {
  const hsva = tinycolor(tinyColor.value).toHsv();
  const res: Record<string, number> = {};
  for (const [key, value] of Object.entries(hsva)) {
    res[key] = value.toFixed(2);
  }
  return res;
});

const textColor = computed(() => {
  return invertColor(tinycolor(tinyColor.value).toRgb());
});

const updateHue = (newHue: number) => {
  tinyColor.value = tinycolor(tinyColor.value).spin(newHue - hsva.value.h).clone();
}

</script>

<template>
  <div class="color-background" :style="[background]"></div>
  <div class="wrapper">
    <div>
      <div class="title roboto" :style="{color: textColor}">
        <h1>Vue-color</h1><span class="tag">v3.0</span>
      </div>

      <main class="intro roboto" :style="{color: textColor}">
        A collection of efficient color pickers designed for modern web development.
        <ul class="feature-list roboto" :style="{color: textColor, opacity: 0.75}">
          <li>✅ Modular & Tree-Shakable</li>
          <li>✅ TypeScript Ready</li>
          <li>✅ SSR-Friendly</li>
          <li>✅ Optimized for Accessibility</li>
        </ul>
      </main>
    </div>
    <div :style="{flex: 0.8}">
      <div class="row">
        <div class="col">
          <div class="roboto current-color" :style="{color: textColor, opacity: 0.5}">
            {{ hex }}<br />
            {{ color }}<br />
            {{ hsva }}
          </div>
          <div class="picker-container">
            <ChromePicker v-model:tinyColor="tinyColor" v-model="color" />
            <div class="picker-title roboto" :style="{color: textColor, opacity: 0.5}">&lt;ChromePicker /&gt;</div>
          </div>
        </div>

        <div class="picker-container">
          <div><SketchPicker v-model:tinyColor="tinyColor" v-model="color" /></div>
          <div class="picker-title roboto" :style="{color: textColor, opacity: 0.5}">&lt;SketchPicker /&gt;</div>
        </div>

        <div class="picker-container">
          <div><PhotoshopPicker v-model:tinyColor="tinyColor" v-model="color" /></div>
          <div class="picker-title roboto" :style="{color: textColor, opacity: 0.5}">&lt;PhotoshopPicker /&gt;</div>
        </div>
      </div>
      <div class="row" :style="{marginTop: '5%'}">
        <div class="col">
          <div class="picker-container">
            <div><CompactPicker v-model:tinyColor="tinyColor" v-model="color" /></div>
            <div class="picker-title roboto" :style="{color: textColor, opacity: 0.5}">&lt;CompactPicker /&gt;</div>
          </div>
          <div class="picker-container">
            <div><GrayscalePicker v-model:tinyColor="tinyColor" v-model="color" /></div>
            <div class="picker-title roboto" :style="{color: textColor, opacity: 0.5}">&lt;GrayscalePicker /&gt;</div>
          </div>
          <div class="picker-container">
            <div><MaterialPicker v-model:tinyColor="tinyColor" v-model="color" /></div>
            <div class="picker-title roboto" :style="{color: textColor, opacity: 0.5}">&lt;MaterialPicker /&gt;</div>
          </div>
        </div>

        <div class="col">
          <div class="picker-container">
            <div :style="{width: '410px'}"><HueSlider :modelValue="hsva.h" @update:modelValue="updateHue" /></div>
            <div class="picker-title roboto" :style="{color: textColor, opacity: 0.5}">&lt;HueSlider /&gt;</div>
          </div>

          <div class="picker-container">
            <div><SliderPicker v-model:tinyColor="tinyColor" v-model="color" :alpha="true" /></div>
            <div class="picker-title roboto" :style="{color: textColor, opacity: 0.5}">&lt;SliderPicker /&gt;</div>
          </div>

          <div class="picker-container">
            <div><TwitterPicker v-model:tinyColor="tinyColor" v-model="color" /></div>
            <div class="picker-title roboto" :style="{color: textColor, opacity: 0.5}">&lt;TwitterPicker /&gt;</div>
          </div>
        </div>

        <div class="col">
          <div class="picker-container">
            <div><SwatchesPicker v-model:tinyColor="tinyColor" v-model="color" /></div>
            <div class="picker-title roboto" :style="{color: textColor, opacity: 0.5}">&lt;SwatchesPicker /&gt;</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scope>
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');
</style>

<style scoped>
.roboto {
  font-family: "Roboto", serif;
  font-optical-sizing: auto;
  font-style: normal;
  font-variation-settings: "wdth" 100;
}

.placeholder {
  display: block;
}

.wrapper {
  display: flex;
  justify-content: space-evenly;
  padding: 50px 0;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.color-background {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}

.title {
  display: flex;
}

.title h1 {
  display: inline-block;
  font-size: 60px;
  font-weight: bold;
  margin: 0;
}

.tag {
  display: block;
  font-size: 16px;
  width: 30px;
  height: 20px;
  border-radius: 6px;
  text-align: center;
  background-color: #42B883;
  padding: 2px 4px;
  margin-left: 10px;
  color: #fff;
}

.intro {
  font-size: 20px;
  line-height: 1.5;
  width: 300px;
}

.feature-list {
  line-height: 1.6;
  padding-left: 0px;
  list-style: none;
  font-size: 18px;
}

.picker-container {
  margin-left: 5%;
}

.picker-title {
  margin-top: 10px;
  font-size: 14px;
}

.current-color {
  padding: 10px;
  width: 240px;
  height: 100px;
  line-height: 1.5;
}
</style>
