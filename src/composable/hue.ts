import tinycolor from "tinycolor2";
import { ref, watch, type WritableComputedRef } from "vue";

function random2Char(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return chars.charAt(Math.floor(Math.random() * chars.length)) +
         chars.charAt(Math.floor(Math.random() * chars.length));
}

export const useHueRef = (tinyColorRef: WritableComputedRef<tinycolor.Instance, tinycolor.Instance>) => {
  const hueRef = ref(0);
  const sourceLabel = `__from__vc__hue__${random2Char()}`;

  watch(tinyColorRef, (tinyColorInstance) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (tinyColorInstance[sourceLabel]) {
      // Don’t update if the change originated from itself.
      return;
    }
    const newHue = tinyColorInstance.toHsl().h;
    // The hue value is likely to be lost when TinyColor converts between color formats, especially when the color is grayscale
    if (newHue === 0 && hueRef.value !== 0) {
      return;
    }
    hueRef.value = newHue;
  }, { immediate: true });

  const updateHueRef = (newHue: number) => {
    const newColorInstance = tinycolor({
      ...tinyColorRef.value.toHsl(),
      h: newHue
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    newColorInstance[sourceLabel] = true;
    tinyColorRef.value = newColorInstance;

    hueRef.value = newHue;
  }

  return { hueRef, updateHueRef };
}