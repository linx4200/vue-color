declare module 'vue-color/vue2' {
  import { Component } from 'vue';
  import tinycolor from 'tinycolor2';

  export const ChromePicker: Component;
  // export const SketchPicker: Component;
  // export const PhotoshopPicker: Component;
  // export const CompactPicker: Component;
  // export const GrayscalePicker: Component;
  // export const MaterialPicker: Component;
  // export const SliderPicker: Component;
  // export const TwitterPicker: Component;
  // export const SwatchesPicker: Component;
  // export const HueSlider: Component;
  export const tinycolor: tinycolor;
}

// shims-css.d.ts
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
