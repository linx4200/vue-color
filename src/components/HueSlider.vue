<template>
  <HueSlider
    class="vc-hue-wrap"
    v-bind="$attrs"
    :modelValue="val"
    @update:modelValue="update"
  />
</template>

<script setup lang="ts">
import HueSlider from './common/HueSlider.vue';
import { computed } from 'vue';

const emit = defineEmits(['input', 'update:modelValue']);

const props = defineProps<{
  modelValue?: number | string;
  /** `value` is for Vue 2.7 compatibility, please use `modelValue` instead if you're using Vue 3.x */
  value?: number | string;
}>();

const val = computed(() => props.modelValue ?? props.value ?? 0);

const update = (newHue: number) => {
  emit('input', newHue);
  emit('update:modelValue', newHue);
}

const thumbColor = computed(() => {
  return `hsl(${val.value}, 100%, 50%)`;
});

</script>

<style scoped>
.vc-hue-wrap {
  position: relative;
  width: 100%;
  height: 8px;
}
.vc-hue-wrap :deep(.container) {
  border-radius: 4px;
}
.vc-hue-wrap :deep(.picker) {
  width: 20px;
  height: 20px;
  margin: 0;
  border-radius: 50%;
  box-shadow: none;
  border: 2px white solid;
  background-color: v-bind('thumbColor');
  transform: translateX(-12px) translateY(-8px);
}
</style>
