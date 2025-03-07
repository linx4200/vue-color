<template>
  <div role="application" aria-label="Grayscale color picker" :class="$style.wrap">
    <ul :class="$style.colors" role="listbox" aria-label="Select a grayscale color" tabindex="0">
      <li
        v-for="c in palette"
        :key="c"
        :class="{[$style.colorItemWhite]: c === '#FFFFFF', [$style.colorItem]: true }"
        :style="{background: c}"
        @click="handlerClick(c)"
        role="option"
        :aria-label="'color:' + c"
        :aria-selected="c.toUpperCase() === pick"
        @keydown.space="handlerClick(c)"
        tabindex="0"
      >
        <div :class="$style.dot" v-show="c.toUpperCase() === pick"></div>
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

<style module>
.wrap {
  padding-top: 5px;
  padding-left: 5px;
  width: 245px;
  border-radius: 2px;
  box-sizing: border-box;
  box-shadow: 0 2px 10px rgba(0,0,0,.12), 0 2px 5px rgba(0,0,0,.16);
  background-color: #fff;
}
.colors {
  overflow: hidden;
  padding: 0;
  margin: 0;
}
.colorItem {
  list-style: none;
  width: 15px;
  height: 15px;
  float: left;
  margin-right: 5px;
  margin-bottom: 5px;
  position: relative;
  cursor: pointer;
}
.colorItemWhite {
  box-shadow: inset 0 0 0 1px #ddd;
}
.colorItemWhite .dot {
  background: #000;
}

.dot {
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