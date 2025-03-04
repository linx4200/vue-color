<script setup lang="ts">
import { effectScope, watch, reactive, computed } from 'vue';
import tinycolor from 'tinycolor2';

import Chrome from './components/ChromePicker.vue';
import Compact from './components/CompactPicker.vue';
import Grayscale from './components/GrayscalePicker.vue';
import Material from './components/MaterialPicker.vue';
import Photoshop from './components/PhotoshopPicker.vue';
import Sketch from './components/SketchPicker.vue';
import Slider from './components/SliderPicker.vue';
import Swatches from './components/SwatchesPicker.vue';
import Twitter from './components/TwitterPicker.vue';

const tinyColor = defineModel('tinycolor', {
  default: '#F5F7FA'
});

const colorRGBA = defineModel({
  default: () => reactive({r: 0, g: 0, b: 255, a: 1})
});

const scope = effectScope();

scope.run(() => {
  watch(tinyColor, () => console.log(tinyColor.value));
});

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
  const hsv = tinycolor(tinyColor.value).toHsv();
  const res: Record<string, number> = {};
  for (const [key, value] of Object.entries(hsv)) {
    res[key] = value.toFixed();
  }
  return res;
});

const textColor = computed(() => {
  return invertColor(tinycolor(tinyColor.value).toRgb());
});

</script>

<template>
  <div class="color-background" :style="[background]"></div>
  <div class="wrapper">
    <div>
      <div class="title roboto" :style="{color: textColor}">
        <h1>Vue-color</h1><span class="tag">v3.0</span>
      </div>

      <div class="intro roboto" :style="{color: textColor}">
        A collection of efficient color pickers designed for modern web development.
        <ul class="feature-list roboto" :style="{color: textColor, opacity: 0.75}">
          <li>✅ Modular & Tree-Shakable</li>
          <li>✅ TypeScript Ready</li>
          <li>✅ SSR-Friendly</li>
          <li>✅ Optimized for Accessibility</li>
        </ul>
      </div>
    </div>
    <div :style="{flex: 0.8}">
      <div class="row">
        <div class="col">
          <div class="roboto current-color" :style="{color: textColor, opacity: 0.5}">
            {{ hex }}<br />
            {{ colorRGBA }}<br />
            {{ hsva }}
          </div>
          <div class="picker-container">
            <div><Chrome v-model:tinyColor="tinyColor" v-model="colorRGBA" /></div>
            <div class="picker-title roboto" :style="{color: textColor, opacity: 0.5}">Chrome</div>
          </div>
        </div>

        <div class="picker-container">
          <div><Sketch v-model:tinyColor="tinyColor" v-model="colorRGBA" /></div>
          <div class="picker-title roboto" :style="{color: textColor, opacity: 0.5}">Sketch</div>
        </div>

        <div class="picker-container">
          <div><Photoshop v-model:tinyColor="tinyColor" v-model="colorRGBA" /></div>
          <div class="picker-title roboto" :style="{color: textColor, opacity: 0.5}">Photoshop</div>
        </div>
      </div>
      <div class="row" :style="{marginTop: '5%'}">
        <div class="col">
          <div class="picker-container">
            <div><Compact v-model:tinyColor="tinyColor" v-model="colorRGBA" /></div>
            <div class="picker-title roboto" :style="{color: textColor, opacity: 0.5}">Compact</div>
          </div>
          <div class="picker-container">
            <div><Grayscale v-model:tinyColor="tinyColor" v-model="colorRGBA" /></div>
            <div class="picker-title roboto" :style="{color: textColor, opacity: 0.5}">Grayscale</div>
          </div>
          <div class="picker-container">
            <div><Material v-model:tinyColor="tinyColor" v-model="colorRGBA" /></div>
            <div class="picker-title roboto" :style="{color: textColor, opacity: 0.5}">Material</div>
          </div>
        </div>

        <div class="col">
          <div class="picker-container">
            <div><Slider v-model:tinyColor="tinyColor" v-model="colorRGBA" /></div>
            <div class="picker-title roboto" :style="{color: textColor, opacity: 0.5}">Slider</div>
          </div>

          <div class="picker-container">
            <div><Twitter v-model:tinyColor="tinyColor" v-model="colorRGBA" /></div>
            <div class="picker-title roboto" :style="{color: textColor, opacity: 0.5}">Twitter</div>
          </div>
        </div>

        <div class="col">
          <div class="picker-container">
            <div><Swatches v-model:tinyColor="tinyColor" v-model="colorRGBA" /></div>
            <div class="picker-title roboto" :style="{color: textColor, opacity: 0.5}">Swatches</div>
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
  line-height: 1.5;
}
</style>
