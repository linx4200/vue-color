import { ref, computed, type WritableComputedRef } from "vue";

// todo: add description: 改变它同时会改变 tinyColorRef 的值
/**
 * maintain the hue value, because the hue value may be lost when converting to tinycolor instance in some cases.
 * @param tinyColorRef
 * @returns
 */
export const retainedHueRef = ({ defaults, colorRef } : { defaults?: number, colorRef?: WritableComputedRef<tinycolor.Instance, tinycolor.Instance>}) => {
  const defaultValue = colorRef?.value.toHsl().h ?? defaults;
  const hueRef = ref<undefined | number>(defaultValue);

  const retainedHueRef = computed({
    get: () => {
      if (typeof hueRef.value !== 'undefined') {
        return hueRef.value;
      }
      if (typeof colorRef !== 'undefined') {
        const { h } = colorRef.value.toHsl();
        if (h !== 0) {
          return h;
        }
      }
      return 0;
    },
    set: (hue: number) => {
      const offset = hue - (hueRef.value ?? 0);
      if (offset !== 0) {
        hueRef.value = hue;
        if (typeof colorRef !== 'undefined') {
          colorRef.value = colorRef.value.spin(offset).clone();
        }
      }
    }
  });
  return retainedHueRef;
}