# TwitterPicker

## Props

Besides `modelValue` and `tinyColor` (used with `v-model` and `v-model:tinyColor` respectively), `<TwitterPicker />` also supports the following props:

| Prop           | Type                                        | Default                   | Description                                                                                                                                             |
|----------------|---------------------------------------------|---------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| `width`        | `number` &#124; `string`                    | `276`                     | Specifies the component's width. If a number is given, it's interpreted as pixels; otherwise, you can provide a valid CSS width string.              |
| `presetColors` | `string[]`                                  | | An array of preset color strings used as available options in the component.        |
| `triangle`     | `'hide'` &#124; `'top-left'` &#124; `'top-right'` | `'top-left'`          | Controls the triangle pointer's display. Use `hide` to omit it; otherwise, specify `top-left` or `top-right` to set its position.                      |

## Events

`<TwitterPicker />` emits `update:modelValue` and `update:tinyColor` events, which are used by `v-model` and `v-model:tinyColor` respectively.
