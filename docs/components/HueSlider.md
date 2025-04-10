# HueSlider

## Props

| Prop       | Type                                | Default      | Description                                                   |
|------------|-------------------------------------|--------------|---------------------------------------------------------------|
| `direction`| `'horizontal'` &#124; `'vertical'`  | `"horizontal"` | Determines the layout orientation of the component. |
|`modelValue`| `number`                            | `0`             | The hue value. The value range is `[0, 360]`.|

## Events

| Event         | Payload   | Description                                                                            |
|---------------|-----------|----------------------------------------------------------------------------------------|
| `update:modelValue`  | `number`  | Emitted when the `hue` value changes. |

## Usage Example

```vue
<script setup>
import { HueSlider } from 'vue-color';

const hue = defineModel();
</script>

<template>
  <HueSlider v-model="hue" />
</template>
```
