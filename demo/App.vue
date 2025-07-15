<script lang="ts">
const DEFAULT_COLOR = 'F5F7FA';
const DEFAULT_COLOR_DARK = '#004035';

import { parseSearchParams } from './utils';
const pickers = ['chrome', 'sketch', 'photoshop', 'compact', 'grayscale', 'material', 'slider', 'twitter', 'swatches', 'hue', 'sliders'] as const;
const searchParams = parseSearchParams(location.search);
const manualEnabledPickers = searchParams.picker?.split(',');

function invertColor({ r, g, b, a}: { r: number; g: number; b: number, a: number }): string {
  const invert = (val: number, alpha: number) => alpha === 0 ? 0 : 255 - val;
  const inverted = {
    r: invert(r, a),
    g: invert(g, a),
    b: invert(b, a),
    a: a < 0.5 ? 1 - a : a
  };
  return `rgba(${inverted.r}, ${inverted.g}, ${inverted.b}, ${inverted.a})`;
}

const hasInitialColor = !!searchParams.hex;
const initialColor = `#${searchParams.hex ?? DEFAULT_COLOR}`;
</script>

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
  HSLSliders,
  HSVSliders,
  RGBSliders,
  tinycolor
// } from '../dist/vue-color.js';
} from '../src';
import ThemeToggle from './components/ThemeToggle.vue';
// import '../dist/vue-color.css';

const showStatus: Record<(typeof pickers)[number], boolean> = {} as Record<(typeof pickers)[number], boolean>;
pickers.forEach((picker) => {
  if (!manualEnabledPickers || manualEnabledPickers.length === 0) {
    showStatus[picker] = true;
  } else {
    showStatus[picker] = manualEnabledPickers.indexOf(picker) > -1;
  }
});

const tinyColor = defineModel('tinyColor', {
  default: tinycolor(initialColor)
});

const color = defineModel({
  default: () => {
    if (hasInitialColor) {
      return initialColor;
    }
    // #F5F7FA
    return reactive({r: 245, g: 247, b: 250, a: 1})
  }
});

watch(color, () => console.log('changed ==>', color.value));

const hex = computed(() => {
  return tinycolor(tinyColor.value).toHex8String();
});

const hsva = computed(() => {
  const hsva = tinycolor(tinyColor.value).toHsv();
  const res: Record<string, number> = {};
  for (const [key, value] of Object.entries(hsva)) {
    res[key] = Number(value.toFixed(2));
  }
  return res;
});

const textColor = computed(() => {
  return invertColor(tinycolor(tinyColor.value).toRgb());
});

const updateHue = (newHue: number) => {
  tinyColor.value = tinycolor(tinyColor.value).spin(newHue - hsva.value.h).clone();
}

const onModeChange = (isDark: boolean) => {
  if (isDark) {
    tinyColor.value = tinycolor(DEFAULT_COLOR_DARK);
  } else {
    tinyColor.value = tinycolor(initialColor);
  }
}

</script>

<template>
  <div class="wrapper">
    <div class="fixed-side">
      <div class="title text">
        <h1>Vue-color</h1>
      </div>

      <main class="intro text">
        A collection of efficient color pickers designed for modern web development.
        <ul class="feature-list text">
          <li>✅ Supports both Vue 2.7 and Vue 3</li>
          <li>✅ Modular & Tree-Shakable</li>
          <li>✅ TypeScript Ready</li>
          <li>✅ SSR-Friendly</li>
          <li>✅ Optimized for Accessibility</li>
          <li class="dark-mode"><span>✅ Supports Dark Theme</span><ThemeToggle style="margin-left: 10px;" :color="textColor" @change="onModeChange" /></li>
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
    <div class="picker-containers">
      <div class="row">
        <div class="col">
          <div class="text current-color">
            {{ hex }}<br />
            {{ tinyColor.toRgbString() }}<br />
            {{ tinyColor.toHsvString() }}
          </div>
          <div v-if="showStatus.chrome">
            <ChromePicker v-model:tinyColor="tinyColor" v-model="color" />
            <div class="picker-title text">&lt;ChromePicker /&gt;</div>
          </div>
        </div>

        <div class="col" v-if="showStatus.sketch">
          <div><SketchPicker v-model:tinyColor="tinyColor" v-model="color" /></div>
          <div class="picker-title text">&lt;SketchPicker /&gt;</div>
        </div>

        <div class="col" v-if="showStatus.photoshop">
          <div><PhotoshopPicker v-model:tinyColor="tinyColor" v-model="color" /></div>
          <div class="picker-title text">&lt;PhotoshopPicker /&gt;</div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div v-if="showStatus.compact">
            <div><CompactPicker v-model:tinyColor="tinyColor" v-model="color" /></div>
            <div class="picker-title text">&lt;CompactPicker /&gt;</div>
          </div>
          <div v-if="showStatus.grayscale">
            <div><GrayscalePicker v-model:tinyColor="tinyColor" v-model="color" /></div>
            <div class="picker-title text">&lt;GrayscalePicker /&gt;</div>
          </div>
          <div v-if="showStatus.material">
            <div><MaterialPicker v-model:tinyColor="tinyColor" v-model="color" /></div>
            <div class="picker-title text">&lt;MaterialPicker /&gt;</div>
          </div>
        </div>

        <div class="col">
          <div v-if="showStatus.hue">
            <div :style="{width: '410px'}"><HueSlider :modelValue="hsva.h" @update:modelValue="updateHue" /></div>
            <div class="picker-title text">&lt;HueSlider /&gt;</div>
          </div>

          <div v-if="showStatus.slider">
            <div><SliderPicker v-model:tinyColor="tinyColor" v-model="color" :alpha="true" /></div>
            <div class="picker-title text">&lt;SliderPicker /&gt;</div>
          </div>

          <div v-if="showStatus.twitter">
            <div><TwitterPicker v-model:tinyColor="tinyColor" v-model="color" /></div>
            <div class="picker-title text">&lt;TwitterPicker /&gt;</div>
          </div>
        </div>

        <div class="col">
          <div v-if="showStatus.swatches">
            <div><SwatchesPicker v-model:tinyColor="tinyColor" v-model="color" /></div>
            <div class="picker-title text">&lt;SwatchesPicker /&gt;</div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col" :style="{width: '330px'}">
          <HSLSliders v-model:tinyColor="tinyColor" v-model="color" />
          <div class="picker-title text">&lt;HSLSliders /&gt;</div>
        </div>
        <div class="col" :style="{width: '330px'}">
          <HSVSliders v-model:tinyColor="tinyColor" v-model="color" />
          <div class="picker-title text">&lt;HSVSliders /&gt;</div>
        </div>
        <div class="col" :style="{width: '330px'}">
          <RGBSliders v-model:tinyColor="tinyColor" v-model="color" />
          <div class="picker-title text">&lt;RGBASliders /&gt;</div>
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
  color: v-bind(textColor);
}

.wrapper {
  display: flex;
  padding: 3%;
  background-color: v-bind(hex);
}

.fixed-side {
  width: 300px;
}

.picker-containers {
  flex: 1;
}

.row {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 3%;
  margin-bottom: 3%;
}

.title {
  margin-bottom: 3%;
}

.title h1 {
  display: inline-block;
  font-size: 60px;
  font-weight: bold;
  margin: 0;
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
  opacity: 0.75;
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

.picker-title {
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 14px;
  opacity: 0.75;
}

.current-color {
  margin-bottom: 10px;
  line-height: 1.7;
  opacity: 0.75;
}
</style>
