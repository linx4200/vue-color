import { computed, type EmitFn } from 'vue';
import tinycolor from 'tinycolor2';

export type useTinyColorModelProps = {
  tinyColor?: tinycolor.ColorInput;
}

// function convert2TinyColor(data: tinycolor.ColorInputWithoutInstance): InternalColor {
//   const internalColor = new tinycolor(data);
//   return {
//     value: internalColor,
//     originalFormat: internalColor.getFormat()
//   }
// }

// function convert2OriginalFormat(color: tinycolor.Instance) = {
//   // return 
// }

// todo: 提供一个参数，转换回去旧的输出格式

// todo: 可能提供一个参数，内部使用就不转换回去原始格式


export const EmitEventName = 'update:tinyColor';

/**
 * To support `v-model:tinyColor="color"`
 * @param props
 * @param emit
 * @returns returns a tinycolor instance wrapped by `computed`, and a function to invoke emit.
 */
export function useTinyColorModel(props: useTinyColorModelProps, emit: EmitFn) {

  const tinyColorRef = computed(() => {
    if (props.tinyColor instanceof tinycolor) {
      return props.tinyColor;
    }
    return new tinycolor(props.tinyColor);
  });

  function updateColor(value: tinycolor.Instance) {
    // 只是起一个通知作用
    emit(EmitEventName, value.clone());
  }

  return { colorRef: tinyColorRef, updateColor }
}
