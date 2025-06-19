<script setup lang="ts">
import { watch, computed, reactive, shallowRef } from 'vue';

import {
  ChromePicker,
  // SketchPicker,
  // PhotoshopPicker,
  // CompactPicker,
  // GrayscalePicker,
  // MaterialPicker,
  // SliderPicker,
  // TwitterPicker,
  // SwatchesPicker,
  // HueSlider,
  tinycolor
} from 'vue-color/vue2';

import 'vue-color/vue2/style.css';

// const DEFAULT_COLOR = '#F5F7FA';
// const DEFAULT_COLOR_DARK = '#004035';

// const tinyColor = defineModel('tinyColor', {
//   default: tinycolor(DEFAULT_COLOR)
// });

const color = shallowRef({r: 245, g: 247, b: 250, a: 1});

// watch(tinyColor, () => console.log('color changed ==>', tinyColor.value));

function invertColor(rgba: { r: number; g: number; b: number, a: number }): string {
  const inverted = {
    r: 255 - rgba.r,
    g: 255 - rgba.g,
    b: 255 - rgba.b,
    a: rgba.a
  };
  return `rgba(${inverted.r}, ${inverted.g}, ${inverted.b}, ${inverted.a})`;
}

const hex = computed(() => {
  return tinycolor(color.value).toHex8String();
});

const background = computed(() => {
  // return {'background-color': hex.value}
  return {'background-color': tinycolor(color.value).toHex8String()}
});

// const hsva = computed(() => {
//   const hsva = tinycolor(tinyColor.value).toHsv();
//   const res: Record<string, number> = {};
//   for (const [key, value] of Object.entries(hsva)) {
//     res[key] = value.toFixed(2);
//   }
//   return res;
// });

const textColor = computed(() => {
  return invertColor(tinycolor(color.value).toRgb());
});

// const updateHue = (newHue: number) => {
//   tinyColor.value = tinycolor(tinyColor.value).spin(newHue - hsva.value.h).clone();
// }

// const onModeChange = (isDark: boolean) => {
//   if (isDark) {
//     tinyColor.value = tinycolor(DEFAULT_COLOR_DARK);
//   } else {
//     tinyColor.value = tinycolor(DEFAULT_COLOR);
//   }
// }

</script>

<template>
  <div>
  <div class="color-background" :style="[background]"></div>
  <div class="wrapper">
    <div>
      <div class="title text" :style="{color: textColor}">
        <h1>Vue-color</h1><span class="tag">v3.0</span>
      </div>

      <main class="intro text" :style="{color: textColor}">
        A collection of efficient color pickers designed for modern web development.
        <ul class="feature-list text" :style="{color: textColor, opacity: 0.75}">
          <li>✅ Modular & Tree-Shakable</li>
          <li>✅ TypeScript Ready</li>
          <li>✅ SSR-Friendly</li>
          <li>✅ Optimized for Accessibility</li>
          <!-- <li class="dark-mode"><span>✅ Supports Dark Theme</span><ThemeToggle style="margin-left: 10px;" :color="textColor" @change="onModeChange" /></li> -->
        </ul>
      </main>
      <a
        class="get-started text"
        href="https://github.com/linx4200/vue-color#-installation"
        :style="{'background-color': textColor.replace('1)', '0.75)'), color: hex}"
        role="button"
        aria-label="Get started with installation on GitHub"
      >
        Get Started &nbsp; 🚀
      </a>
    </div>
    <div :style="{flex: 0.8}">
      <div class="row">
        <div class="col">
          <div class="text current-color" :style="{color: textColor, opacity: 0.5}">
            {{ hex }}<br />
            {{ color }}<br />
            <!-- {{ hsva }} -->
          </div>
          <div class="picker-container">
            <ChromePicker v-model="color" />
            <!-- <ChromePicker :modelValue="color" /> -->
            <div class="picker-title text" :style="{color: textColor, opacity: 0.5}">&lt;ChromePicker /&gt;</div>
          </div>
        </div>

        <!-- <div class="picker-container">
          <div><SketchPicker v-model:tinyColor="tinyColor" v-model="color" /></div>
          <div class="picker-title text" :style="{color: textColor, opacity: 0.5}">&lt;SketchPicker /&gt;</div>
        </div> -->

        <!-- <div class="picker-container">
          <div><PhotoshopPicker v-model:tinyColor="tinyColor" v-model="color" /></div>
          <div class="picker-title text" :style="{color: textColor, opacity: 0.5}">&lt;PhotoshopPicker /&gt;</div>
        </div> -->
      </div>
      <div class="row" :style="{marginTop: '5%'}">
        <!-- <div class="col">
          <div class="picker-container">
            <div><CompactPicker v-model:tinyColor="tinyColor" v-model="color" /></div>
            <div class="picker-title text" :style="{color: textColor, opacity: 0.5}">&lt;CompactPicker /&gt;</div>
          </div>
          <div class="picker-container">
            <div><GrayscalePicker v-model:tinyColor="tinyColor" v-model="color" /></div>
            <div class="picker-title text" :style="{color: textColor, opacity: 0.5}">&lt;GrayscalePicker /&gt;</div>
          </div>
          <div class="picker-container">
            <div><MaterialPicker v-model:tinyColor="tinyColor" v-model="color" /></div>
            <div class="picker-title text" :style="{color: textColor, opacity: 0.5}">&lt;MaterialPicker /&gt;</div>
          </div>
        </div> -->

        <!-- <div class="col">
          <div class="picker-container">
            <div :style="{width: '410px'}"><HueSlider :modelValue="hsva.h" @update:modelValue="updateHue" /></div>
            <div class="picker-title text" :style="{color: textColor, opacity: 0.5}">&lt;HueSlider /&gt;</div>
          </div>

          <div class="picker-container">
            <div><SliderPicker v-model:tinyColor="tinyColor" v-model="color" :alpha="true" /></div>
            <div class="picker-title text" :style="{color: textColor, opacity: 0.5}">&lt;SliderPicker /&gt;</div>
          </div>

          <div class="picker-container">
            <div><TwitterPicker v-model:tinyColor="tinyColor" v-model="color" /></div>
            <div class="picker-title text" :style="{color: textColor, opacity: 0.5}">&lt;TwitterPicker /&gt;</div>
          </div>
        </div> -->

        <!-- <div class="col">
          <div class="picker-container">
            <div><SwatchesPicker v-model:tinyColor="tinyColor" v-model="color" /></div>
            <div class="picker-title text" :style="{color: textColor, opacity: 0.5}">&lt;SwatchesPicker /&gt;</div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
  </div>
</template>

<style scoped>
.text {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
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
  margin-bottom: 18px;
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
  line-height: 1.8;
  width: 300px;
}

.feature-list {
  line-height: 1.8;
  padding-left: 0px;
  list-style: none;
  font-size: 18px;
}

.dark-mode {
  display: flex;
  align-items: center;
}

.get-started {
  display: inline-block;
  width: 124px;
  height: 24px;
  padding: 8px 12px;
  line-height: 24px;
  text-align: center;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: opacity 0.2s;
}

.get-started:hover {
  opacity: 0.8;
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
