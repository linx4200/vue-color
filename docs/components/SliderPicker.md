# SliderPicker

## Props

Besides `modelValue` and `tinyColor` (used with `v-model` and `v-model:tinyColor` respectively), `<SliderPicker />` also supports the following props:

| Prop            | Type                         | Default                  | Description |
|-----------------|------------------------------|--------------------------|-------------|
| `swatches` | `Array<string \| {s: number, l: number}>` |  | Specifies an array of preset color swatches. |
| `alpha` | `Boolean` | `false` | Determines whether an alpha (opacity) slider is displayed. |

## Events

`<SliderPicker />` emits `update:modelValue` and `update:tinyColor` events, which are used by `v-model` and `v-model:tinyColor` respectively.
