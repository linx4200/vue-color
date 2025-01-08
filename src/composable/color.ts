import { ref } from 'vue';
import tinycolor from 'tinycolor2';

export type useTinyColorModelProps = {
  tinyColor: tinycolor.ColorInputWithoutInstance
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
// 使用了就自动支持 v-model:internal="color" 的输入方式
// 返回内部使用 color
// todo: any
export function useTinyColorModel(props: useTinyColorModelProps, emit: any) {

  // tiny color 对象是响应式的，直接改动可触发 UI 更新
  const tinyColorRef = ref(new tinycolor(props.tinyColor));

  function updateColor(value: tinycolor.Instance) {
    // 只是起一个通知作用
    emit(EmitEventName, value.clone());
  }

  return { color: tinyColorRef.value, updateColor }
}
