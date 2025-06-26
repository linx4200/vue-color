<script setup lang="ts">
import { version, ref, computed, watch } from 'vue';

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
} from 'vue-color/vue2';

import 'vue-color/vue2/style.css';

const color = ref('#5c8f94');

watch(color, () => console.log('color changed ==>', color.value));

const hsva = computed(() => {
  return tinycolor(color.value).toHsv();
});

const updateHue = (newHue: number) => {
  color.value = tinycolor(color.value).spin(newHue - hsva.value.h).clone().toHex8String();
}

</script>

<template>
  <div>
    <div class="version-banner">&blacktriangleright; This demo is running on Vue {{version}} &blacktriangleleft;</div>
    <div class="wrapper">
      <ChromePicker v-model="color" />
      <SketchPicker v-model="color" />
      <PhotoshopPicker v-model="color" />
      <HueSlider :modelValue="hsva.h" @update:modelValue="updateHue" class="test-hue-slider" />
      <CompactPicker v-model="color" />
      <GrayscalePicker v-model="color" />
      <MaterialPicker v-model="color" />
      <TwitterPicker v-model="color" />
      <SwatchesPicker v-model="color" />
      <SliderPicker v-model="color" />
    </div>
  </div>
</template>

<style scoped>
.version-banner {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  background-color: black;
  color: white;
  font-weight: bold;
  text-align: center;
  padding: 5px 0;
}
.wrapper {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
  font-variation-settings: "wdth" 100;
  padding: 50px;
  background-color: v-bind(color);
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 50px;
}

.test-hue-slider {
  width: 600px;
}
</style>