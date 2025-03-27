<template>
  <div role="application" aria-label="Material color inputs" class="vc-material-picker">
    <EdIn class="hex" label="hex" :value="tinyColorRef.toHexString()"
      :style="{ borderColor: tinyColorRef.toHexString() }" @change="onHexChange" :a11y="{label: 'Hex'}"></EdIn>

    <div class="rgb">
      <div class="color">
        <EdIn label="r" :value="rgb.r" @change="(v) => onChange('r', v)" :a11y="{label: 'Red'}"></EdIn>
      </div>
      <div class="color">
        <EdIn label="g" :value="rgb.g" @change="(v) => onChange('g', v)" :a11y="{label: 'Green'}"></EdIn>
      </div>
      <div class="color">
        <EdIn label="b" :value="rgb.b" @change="(v) => onChange('b', v)" :a11y="{label: 'Blue'}"></EdIn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import tinycolor from 'tinycolor2';
import EdIn from './common/EditableInput.vue';
import { useTinyColorModel, EmitEventNames, type useTinyColorModelProps } from '../composable/vmodel.ts';

const props = defineProps<useTinyColorModelProps>();
const emit = defineEmits(EmitEventNames);

const { colorRef: tinyColorRef, updateColor: updateTinyColor } = useTinyColorModel(props, emit);

const rgb = computed(() => tinyColorRef.value.toRgb());

function onHexChange(hex: string) {
  if (tinycolor(hex).isValid()) {
    updateTinyColor(hex);
  }
}

function onChange(key: 'r' | 'g' | 'b', value: number) {
  updateTinyColor({
    ...rgb.value,
    [key]: value
  });
}
</script>

<style scoped>
.vc-material-picker {
  width: 98px;
  height: 98px;
  padding: 16px;
  font-family: "Roboto";
  position: relative;
  border-radius: 2px;
  box-shadow: 0 2px 10px rgba(0,0,0,.12), 0 2px 5px rgba(0,0,0,.16);
  background-color: #fff;
}

.vc-material-picker :deep(.vc-input-input) {
  width: 100%;
  margin-top: 12px;
  font-size: 15px;
  color: #333;
  height: 30px;
}

.vc-material-picker :deep(.vc-input-label) {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 11px;
  color: #999;
}

.hex {
  border-bottom-width: 2px;
  border-bottom-style: solid;
}
.rgb {
  display: flex;
  margin-right: -10px;
  padding-top: 11px;
}
.color {
  flex: 1;
  padding-right: 10px;
}
</style>