import { ref, computed, type WritableComputedRef, watch } from "vue";

/**
 * Creates a reactive reference to the hue value of a given color, retaining the hue value 
 * independently from the color reference and allowing for updates via a computed property.
 * Because tinycolor may lose the hue value when converting formats, especially when v = 0 / s = 0.
 *
 * @param {Object} params - The parameters object.
 * @param {number} [params.defaults] - An optional initial hue value to use if `colorRef` is undefined or doesn't provide one.
 * @param {WritableComputedRef<tinycolor.Instance, tinycolor.Instance>} [params.colorRef] - 
 *   A writable computed reference to a `tinycolor` color object. This reference is observed and updated when the hue changes.
 *
 * @returns {ComputedRef<number>} A computed reference representing the retained hue value. 
 *   - `get`: Returns the stored hue value if available, otherwise derives it from `colorRef`, falling back to `0`.
 *   - `set`: Updates both the internal hue and `colorRef` by spinning the color to match the new hue.
 *
 * @example
 * const color = ref(tinycolor("#00ff00"));
 * const hue = retainedHueRef({ colorRef: computed({
 *   get: () => color.value,
 *   set: val => { color.value = val; }
 * }) });
 *
 * hue.value = 120; // Spins the color to match hue 120
 */
export const retainedHueRef = ({ defaults, colorRef } : { defaults?: number, colorRef?: WritableComputedRef<tinycolor.Instance, tinycolor.Instance>}) => {
  const hueRef = ref<undefined | number>(defaults);

  if (typeof colorRef !== 'undefined') {
    watch(colorRef, () => {
      const h = colorRef?.value.toHsl().h;
      if (h !== hueRef.value) {
        hueRef.value = h;
      }
    });
  }

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