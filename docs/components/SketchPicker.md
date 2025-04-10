# SketchPicker

## Props

Besides `modelValue` and `tinyColor` (used with `v-model` and `v-model:tinyColor` respectively), `<SketchPicker />` also supports the following props:

| Prop            | Type                         | Default                  | Description |
|-----------------|------------------------------|--------------------------|-------------|
| `disableAlpha`  | `Boolean`                    | `false`                  | Hides the alpha (opacity) slider and input when set to `true`. |
| `disableFields` | `Boolean`                    | `false`                  | Hides all color input fields when set to `true`. |
| `presetColors`       | `string[]` |  | Defines the color palette displayed as preset swatches in the component. |

## Events

`<SketchPicker />` emits `update:modelValue` and `update:tinyColor` events, which are used by `v-model` and `v-model:tinyColor` respectively.
