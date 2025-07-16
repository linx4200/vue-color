# HSLSliders

## Props

Besides `modelValue` and `tinyColor` (used with `v-model` and `v-model:tinyColor` respectively), `<HSLSliders />` also supports the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `disableAlpha` | `Boolean` | `false` | Hides the alpha (opacity) slider and input when set to `true`. |
| `disableFields` | `Boolean` | `false` | Hides all color input fields when set to `true`. |

## Events

`<HSLSliders />` emits `update:modelValue` and `update:tinyColor` events, which are used by `v-model` and `v-model:tinyColor` respectively.