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

/**
 * Props used to bind color values via v-model in Vue 3 and Vue 2.7.
 *
 * ⚠️ Note: Due to a known limitation in Vue 2.7 (see https://github.com/vuejs/core/issues/4294#issuecomment-1025210436),
 * `defineProps` does not support type extension. As a result, this type definition is currently duplicated
 * where needed instead of being reused via extends.
 */
export interface defineColorModelProps {
  /**
   * Used with `v-model:tinyColor`. Accepts any valid TinyColor input format.
   */
  tinyColor?: tinycolor.ColorInput;
  /**
   * Used with `v-model`. Accepts any valid TinyColor input format.
   */
  modelValue?: tinycolor.ColorInput;
  /**
   * Fallback for `v-model` compatibility in Vue 2.7.
   * Accepts any valid TinyColor input.
   */
  value?: tinycolor.ColorInput;
}

// todo: 3. 单测

export const EmitEventNames = ['update:tinyColor', 'update:modelValue', 'input'];

export function defineColorModel(props: defineColorModelProps, emit: EmitFn) {

  let isObjectOriginally: boolean;
  let originalFormat: TinyColorFormat;

  const tinyColorRef = computed({
    get: () => {
      const colorInput = props.tinyColor ?? props.modelValue ?? props.value;
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
    // backward compatible for v-model in Vue 2.7
    if (Object.prototype.hasOwnProperty.call(props, 'value')) {
      emit('input', transformToOriginalInputFormat(newValue, originalFormat, isObjectOriginally));
    }
  }

  return tinyColorRef;
}
