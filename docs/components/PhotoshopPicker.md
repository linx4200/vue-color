# PhotoshopPicker

## Props

Besides `modelValue` and `tinyColor` (used with `v-model` and `v-model:tinyColor` respectively), `<PhotoshopPicker />` also supports the following props:

| Prop             | Type     | Default           | Description                                                                                                                                          |
|------------------|----------|-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| `title`          | `string` | `"Color picker"`  | The title displayed at the top of the picker dialog.                                                                                               |
| `disableFields`  | `boolean`| `false`           | If set to `true`, the color input fields (HSV, RGB and HEX inputs) are disabled.                                                                       |
| `hasResetButton` | `boolean`| `false`           | When `true`, a Reset button is displayed in the picker, allowing users to revert to the original color.                                              |
| `okLabel`        | `string` | `"OK"`            | The label text for the OK button, which confirms the selected color.                                                                               |
| `cancelLabel`    | `string` | `"Cancel"`        | The label text for the Cancel button, which closes the dialog without applying changes.                                                            |
| `resetLabel`     | `string` | `"Reset"`         | The label text for the Reset button.                                                                                                               |
| `newLabel`       | `string` | `"new"`           | Text label used to denote the newly selected color preview.                                                                                        |
| `currentLabel`   | `string` | `"current"`       | Text label used to denote the currently active color ( `currentColor`).                                                                                     |
| `currentColor`   | `string` | `"#fff"`          | The initial current color value used as a reference for the original color (useful for the Reset functionality).                                       |

## Events

`<PhotoshopPicker />` emits `update:modelValue` and `update:tinyColor` events, which are used by `v-model` and `v-model:tinyColor` respectively.

| Event                 | Payload        | Description                                                                                                        |
|-----------------------|----------------|--------------------------------------------------------------------------------------------------------------------|
| `ok`                  | —              | Emitted when the user clicks the OK button to confirm the selected color.                                          |
| `cancel`              | —              | Emitted when the user clicks the Cancel button to close the dialog without applying changes.                         |
| `reset`               | —              | Emitted when the user clicks the Reset button. Usually it's used to restore the original color (as defined by `currentColor`).            |
