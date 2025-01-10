import { computed } from 'vue';
import tinycolor from 'tinycolor2';

// todo: test all input format
const transformToOriginalInputFormat = (color: tinycolor.Instance, isObjectOriginally = false) => {
  if (isObjectOriginally) {
    const format = color.getFormat();
    switch (format) {
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
 * @returns returns a tinycolor instance wrapped by `computed`, and a function to invoke emit.
 */
export function useTinyColorModel(props: useTinyColorModelProps, emit: any) {

  let isObjectOriginally = false;

  const tinyColorRef = computed(() => {
    if (typeof props.modelValue === 'object') {
      isObjectOriginally = true;
    }
    return new tinycolor(props.modelValue ?? props.tinyColor);
  });

  function updateColor(value: tinycolor.Instance) {
    if (props.tinyColor) {
      emit('update:tinyColor', value.clone());
    }
    if (props.modelValue) {
      emit('update:modelValue', transformToOriginalInputFormat(value, isObjectOriginally));
    }
  }

  return { colorRef: tinyColorRef, updateColor }
}
