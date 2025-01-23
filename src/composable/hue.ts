import { ref, computed, type WritableComputedRef } from "vue";

export const hueModel = (tinyColorRef: WritableComputedRef<tinycolor.Instance, tinycolor.Instance>, updateTinyColor: (value: tinycolor.ColorInput) => void) => {
  // maintain the hue value, because the hue value may be lost when converting to tinycolor instance in some cases.
  const hueRef = ref<undefined | number>(undefined);

  const retainedHueRef = computed(() => {
    const { h } = tinyColorRef.value.toHsl();
    if (h !== 0) {
      return h;
    }
    // fallback use the hue value of <Hue />
    if (typeof hueRef.value !== 'undefined') {
      return hueRef.value;
    }
    return 0;
  });

  const setHue = (hue: number, offset: number) => {
    hueRef.value = hue;
    updateTinyColor(tinyColorRef.value.spin(offset));
  };

  return {
    /** use for Editable Input to change the hue value */
    hueRef,
    /** use for the change event of <Hue /> Component */
    setHue,
    /**
     * use for hue value of all color components
     * this hue value handles the case when the hue value is lost when converting to tinycolor instance
     */
    retainedHueRef
  };
}