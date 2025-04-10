# GrayscalePicker

## Props

Besides `modelValue` and `tinyColor` (used with `v-model` and `v-model:tinyColor` respectively), `<GrayscalePicker />` also supports the following props:

| Prop            | Type                         | Default                  | Description |
|-----------------|------------------------------|--------------------------|-------------|
| `palette` | `string[]` |  | Defines the color palette displayed as preset swatches in the component. |

## Events

`<GrayscalePicker />` emits `update:modelValue` and `update:tinyColor` events, which are used by `v-model` and `v-model:tinyColor` respectively.
