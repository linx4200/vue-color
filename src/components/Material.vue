<template>
  <div role="application" aria-label="Material color picker" class="vc-material">
    <EdIn class="vc-material-hex" label="hex" :value="tinyColorRef.toHexString()"
      :style="{ borderColor: tinyColorRef.toHex() }" @change="onHexChange"></EdIn>

    <div class="vc-material-split">
      <div class="vc-material-third">
        <EdIn label="r" :value="rgb.r" @change="(v) => onChange('r', v)"></EdIn>
      </div>
      <div class="vc-material-third">
        <EdIn label="g" :value="rgb.g" @change="(v) => onChange('g', v)"></EdIn>
      </div>
      <div class="vc-material-third">
        <EdIn label="b" :value="rgb.b" @change="(v) => onChange('b', v)"></EdIn>
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

<style>
.vc-material {
  width: 98px;
  height: 98px;
  padding: 16px;
  font-family: "Roboto";
  position: relative;
  border-radius: 2px;
  box-shadow: 0 2px 10px rgba(0,0,0,.12), 0 2px 5px rgba(0,0,0,.16);
  background-color: #fff;
}

.vc-material .vc-input__input {
  width: 100%;
  margin-top: 12px;
  font-size: 15px;
  color: #333;
  height: 30px;
}

.vc-material .vc-input__label {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 11px;
  color: #999;
  text-transform: capitalize;
}

.vc-material-hex {
  border-bottom-width: 2px;
  border-bottom-style: solid;
}
.vc-material-split {
  display: flex;
  margin-right: -10px;
  padding-top: 11px;
}
.vc-material-third {
  flex: 1;
  padding-right: 10px;
}
</style>