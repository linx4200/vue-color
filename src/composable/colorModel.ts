import { computed, type EmitFn } from 'vue';
import tinycolor from 'tinycolor2';
import { isVue2 } from '../utils/version';

const IS_VUE_2 = isVue2();

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

type colorModelProps = {
  tinyColor?: tinycolor.ColorInput;
  modelValue?: tinycolor.ColorInput;
  value?: tinycolor.ColorInput;
}

// todo: 1. 注释  2. 关注 TS 类型 3. 单测  4. value 只有 vue2 才加
export const colorModelProps = {
  tinyColor: [tinycolor, String, Object],
  modelValue: [tinycolor, String, Object],
  value: [tinycolor, String, Object],
}

// todo: input 只有 vue2 才加
export const EmitEventNames = ['update:tinyColor', 'update:modelValue', 'input'];

export function defineColorModel(props: colorModelProps, emit: EmitFn) {

  let isObjectOriginally: boolean;
  let originalFormat: TinyColorFormat;

  const tinyColorRef = computed({
    get: () => {
      let colorInput = props.tinyColor ?? props.modelValue;
      console.log('==colorInput===>', colorInput);
      if (IS_VUE_2 && typeof colorInput === 'undefined') {
        // backward compatible for v-model in Vue 2.7
        colorInput = props.value;
      }
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
    if (IS_VUE_2 && Object.prototype.hasOwnProperty.call(props, 'value')) {
      emit('input', transformToOriginalInputFormat(newValue, originalFormat, isObjectOriginally));
    }
  }

  return tinyColorRef;
}
