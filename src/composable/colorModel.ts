import { computed, type EmitFn } from 'vue';
import tinycolor from 'tinycolor2';
import { log } from '../utils/log';

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
        /* v8 ignore next 2 */
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hasActualValueOwnProperty = (obj: Record<any, any>, keyName: string) => {
  if (Object.prototype.hasOwnProperty.call(obj, keyName)) {
    if (typeof obj[keyName] !== 'undefined') {
      return true;
    }
  }
  return false;
}

const isUndefined = (value: unknown) => typeof value === 'undefined';

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

// todo: 单测: 单独的 vue2 测试环境，再建一个独立文件选几个典型的组件测试测试 v-model

export const EmitEventNames = ['update:tinyColor', 'update:modelValue', 'input'];

export function defineColorModel(props: defineColorModelProps, emit: EmitFn, name?: string) {

  let isObjectOriginally: boolean;
  let originalFormat: TinyColorFormat;

  const logName = name ?? 'unknown';

  const tinyColorRef = computed({
    get: () => {

      const { modelValue, tinyColor, value } = props;

      // props.value is used to be compatible for v-model in Vue 2.7
      const colorInput = tinyColor ?? modelValue ?? value;

      log(logName, 'Received modelValue:', modelValue, 'tinyColor:', tinyColor, 'value:', value);

      if (isUndefined(originalFormat)) {
        if (!isUndefined(value)) {
          originalFormat = tinycolor(value).getFormat() as TinyColorFormat;
        }
        if (!isUndefined(modelValue)) {
          originalFormat = tinycolor(modelValue).getFormat() as TinyColorFormat;
        }
      }

      if (isUndefined(isObjectOriginally)) {
        if (typeof value === 'object' && !(value instanceof tinycolor)) {
          isObjectOriginally = true;
        }
        if (typeof modelValue === 'object') {
          isObjectOriginally = true;
        }
      }
      return tinycolor(colorInput);
    },
    set: (newValue: tinycolor.ColorInput) => {
      updateColor(newValue);
    }
  });

  const updateColor = (value: tinycolor.ColorInput) => {
    log(logName, 'got updated value`', value);

    const tinycolorValue = tinycolor(value);

    if (hasActualValueOwnProperty(props, 'tinyColor')) {
      log(logName, 'emit `update:tinyColor`', tinycolorValue);
      emit('update:tinyColor', tinycolorValue);
    }

    if (hasActualValueOwnProperty(props, 'modelValue')) {
      const newValue = transformToOriginalInputFormat(tinycolorValue, originalFormat, isObjectOriginally);

      log(logName, 'emit `update:modelValue`', newValue);
      emit('update:modelValue', newValue);
    }

    // backward compatible for v-model in Vue 2.7
    if (hasActualValueOwnProperty(props, 'value')) {
      const newValue = transformToOriginalInputFormat(tinycolorValue, originalFormat, isObjectOriginally);

      log(logName, 'emit `input`', newValue);
      emit('input', newValue);
    }
  }

  return tinyColorRef;
}
