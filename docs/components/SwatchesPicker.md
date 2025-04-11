# SwatchesPicker

## Props

Besides `modelValue` and `tinyColor` (used with `v-model` and `v-model:tinyColor` respectively), `<SwatchesPicker />` also supports the following props:

| Prop            | Type                         | Default                  | Description |
|-----------------|------------------------------|--------------------------|-------------|
| `palette` | `string[][]` |  | Defines the color palette displayed as preset swatches in the component. |

## Events

`<SwatchesPicker />` emits `update:modelValue` and `update:tinyColor` events, which are used by `v-model` and `v-model:tinyColor` respectively.
