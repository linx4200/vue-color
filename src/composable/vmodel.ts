import { computed, type EmitFn } from 'vue';
import tinycolor from 'tinycolor2';

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
    let newValue = color.toString(originalFormat);
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

/**
 * To support `v-model:tinyColor="color"`
 * @param props
 * @param emit
 * @returns a tinycolor instance wrapped by `computed` and a function to invoke emit;
 */
export function useTinyColorModel(props: useTinyColorModelProps, emit: EmitFn) {

  let isObjectOriginally: boolean;
  let originalFormat: TinyColorFormat;

  const tinyColorRef = computed({
    get: () => {
      const colorInput = props.modelValue ?? props.tinyColor;
      const value = tinycolor(colorInput);
      if (typeof originalFormat === 'undefined') {
        originalFormat = value.getFormat() as TinyColorFormat;
      }
      if (typeof isObjectOriginally === 'undefined') {
        if (typeof props.modelValue === 'object') {
          isObjectOriginally = true;
        }
      }
      return value;
    },
    set: (newValue: tinycolor.Instance) => {
      updateColor(newValue);
    }
  });

  const updateColor = (value: tinycolor.ColorInput) => {
    const newValue = tinycolor(value);
    if (props.tinyColor) {
      emit('update:tinyColor', newValue.clone());
    }
    if (props.modelValue) {
      emit('update:modelValue', transformToOriginalInputFormat(newValue, originalFormat, isObjectOriginally));
    }
  }

  return {
    colorRef: tinyColorRef,
    updateColor,
  };
}
