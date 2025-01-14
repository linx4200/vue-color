<template>
  <div role="application" aria-label="Compact color picker" class="vc-compact">
    <ul class="vc-compact-colors" role="listbox">
      <li
        v-for="c in palette"
        role="option"
        :aria-label="'color:' + c"
        :aria-selected="c.toUpperCase() === pick"
        class="vc-compact-color-item"
        :key="c"
        :class="{'vc-compact-color-item--white': c === '#FFFFFF' }"
        :style="{background: c}"
        @click="handlerClick(c)"
      >
        <div class="vc-compact-dot" v-show="c.toUpperCase() === pick"></div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
const defaultColors = [
  '#FFFFFF', '#F2F2F2', '#E6E6E6', '#D9D9D9', '#CCCCCC', '#BFBFBF', '#B3B3B3',
  '#A6A6A6', '#999999', '#8C8C8C', '#808080', '#737373', '#666666', '#595959',
  '#4D4D4D', '#404040', '#333333', '#262626', '#0D0D0D', '#000000'
]
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { useTinyColorModel, EmitEventNames, type useTinyColorModelProps } from '../composable/vmodel.ts';

type Props = {
  palette?: string[];
}

const props = withDefaults(defineProps<Props & useTinyColorModelProps>(), {
  palette: () => defaultColors
});

const emit = defineEmits(['change'].concat(EmitEventNames));

const { colorRef: tinyColorRef, updateColor: updateTinyColor } = useTinyColorModel(props, emit);

const pick = computed(() => {
  return tinyColorRef.value.toHexString().toUpperCase();
});

const handlerClick = (hex: string) => {
  updateTinyColor(hex);
}
</script>

<style>
.vc-compact {
  padding-top: 5px;
  padding-left: 5px;
  width: 245px;
  border-radius: 2px;
  box-sizing: border-box;
  box-shadow: 0 2px 10px rgba(0,0,0,.12), 0 2px 5px rgba(0,0,0,.16);
  background-color: #fff;
}
.vc-compact-colors {
  overflow: hidden;
  padding: 0;
  margin: 0;
}
.vc-compact-color-item {
  list-style: none;
  width: 15px;
  height: 15px;
  float: left;
  margin-right: 5px;
  margin-bottom: 5px;
  position: relative;
  cursor: pointer;
}
.vc-compact-color-item--white {
  box-shadow: inset 0 0 0 1px #ddd;
}
.vc-compact-color-item--white .vc-compact-dot {
  background: #000;
}

.vc-compact-dot {
  position: absolute;
  top: 5px;
  right: 5px;
  bottom: 5px;
  left: 5px;
  border-radius: 50%;
  opacity: 1;
  background: #fff;
}
</style>