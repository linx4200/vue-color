import { computed } from 'vue';
import tinycolor from 'tinycolor2';

// todo: test all input format
const transformToOriginalInputFormat = (color: tinycolor.Instance, isObjectOriginally = false, originalFormat: string) => {
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
    let newValue = color.toString();
    try {
      newValue = JSON.parse(newValue);
    } catch (e) {
      // no need to handle
    }
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
export function useTinyColorModel(props: useTinyColorModelProps, emit: any) {

  let isObjectOriginally = false;
  let originalFormat = '';

  const tinyColorRef = computed({
    get: () => {
      if (typeof props.modelValue === 'object') {
        isObjectOriginally = true;
      }
      const colorInput = props.modelValue ?? props.tinyColor;
      const value = tinycolor(colorInput);
      originalFormat = value.getFormat();
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
      emit('update:modelValue', transformToOriginalInputFormat(newValue, isObjectOriginally, originalFormat));
    }
  }

  return {
    colorRef: tinyColorRef,
    updateColor,
  };
}
