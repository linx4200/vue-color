<template>
  <BaseSlider
    class="vc-alpha-slider"
    :model-value="alpha"
    :max="1"
    aria-label="Transparency"
    @update:model-value="handleChange"
  >
    <template #background>
      <div class="checkerboard">
        <Checkerboard />
      </div>
      <div class="gradient" :style="{background: gradientColor}"></div>
    </template>
  </BaseSlider>
</template>

<script setup lang="ts">
import tinycolor from 'tinycolor2';
import { computed } from 'vue';
import Checkerboard from './CheckerboardBG.vue';
import BaseSlider from './BaseSlider.vue';
import { defineColorModel, EmitEventNames } from '../../composable/colorModel.ts';

type Props = {
  /**
   * Used with `v-model:tinyColor`. Accepts any valid TinyColor input format.
   */
  tinyColor?: tinycolor.ColorInput;
  /**
   * Used with `v-model`. Accepts any valid TinyColor input format.
   */
  modelValue?: tinycolor.ColorInput;
  /**
   * Fallback for `v-model` compatibility in Vue 2.7.
   * Accepts any valid TinyColor input.
   */
  value?: tinycolor.ColorInput;
};

const props = defineProps<Props>();
const emit = defineEmits(EmitEventNames);

const colorRef = defineColorModel(props, emit, 'alpha');

const gradientColor = computed(() => {
  const rgba = colorRef.value.toRgb();
  const rgbStr = [rgba.r, rgba.g, rgba.b].join(',');
  return 'linear-gradient(to right, rgba(' + rgbStr + ', 0) 0%, rgba(' + rgbStr + ', 1) 100%)';
});

const alpha = computed(() => colorRef.value.getAlpha());

function handleChange (value: number) {
  if (alpha.value !== value) {
    colorRef.value = colorRef.value.setAlpha(value).clone();
  }
}
</script>

<style scoped>
.checkerboard {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  border-radius: 2px;
  overflow: hidden;
}
.gradient {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
}
</style>
