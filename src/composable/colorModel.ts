import { computed, type EmitFn } from 'vue';
import tinycolor from 'tinycolor2';

/** extracted from function `inputToRGB` of tinycolor2 */
type TinyColorFormat = 'name' | 'hex8' | 'hex' | 'prgb' | 'rgb' | 'hsv' | 'hsl';

const transformToOriginalInputFormat = (color: tinycolor.Instance, originalFormat?: TinyColorFormat, isObjectOriginally = false) => {
  if (isObjectOriginally) {
    switch (originalFormat) {
      case 'rgb': {
        return color.toRgb();
      }
      case 'prgb': {
        return color.toPercentageRgb();
      }
      case 'hsl': {
        return color.toHsl();
      }
      case 'hsv': {
        return color.toHsv();
      }
      default: {
        return null;
      }
    }
  } else {
    // transform back to the original format
    // Only 'hex' with alpha needs to be handled specifically
    // tinycolor2 handles alpha correctly for all other formats internally.
    let format = originalFormat;
    if (originalFormat === 'hex' && color.getAlpha() < 1) {
      format = 'hex8';
    }
    let newValue = color.toString(format);
    try {
      newValue = JSON.parse(newValue);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) { /* no need to handle */ }
    return newValue;
  }
}

export type useTinyColorModelProps = {
  tinyColor?: tinycolor.ColorInput;
  modelValue?: tinycolor.ColorInput;
}

export const EmitEventNames = ['update:tinyColor', 'update:modelValue'];

export function defineColorModel(props: useTinyColorModelProps, emit: EmitFn) {

  let isObjectOriginally: boolean;
  let originalFormat: TinyColorFormat;

  const tinyColorRef = computed({
    get: () => {
      const { modelValue } = props;
      const colorInput = props.tinyColor ?? modelValue;
      const value = tinycolor(colorInput);
      if (typeof originalFormat === 'undefined') {
        if (typeof modelValue !== 'undefined') {
          originalFormat = tinycolor(modelValue).getFormat() as TinyColorFormat;
        }
      }
      if (typeof isObjectOriginally === 'undefined') {
        if (typeof modelValue === 'object') {
          isObjectOriginally = true;
        }
      }
      return value;
    },
    set: (newValue: tinycolor.ColorInput) => {
      updateColor(newValue);
    }
});

  const updateColor = (value: tinycolor.ColorInput) => {
    const newValue = tinycolor(value);
    if (Object.prototype.hasOwnProperty.call(props, 'tinyColor')) {
      emit('update:tinyColor', newValue);
    }
    if (Object.prototype.hasOwnProperty.call(props, 'modelValue')) {
      emit('update:modelValue', transformToOriginalInputFormat(newValue, originalFormat, isObjectOriginally));
    }
  }

  return tinyColorRef;
}
