<template>
  <div role="application" aria-label="Compact color picker" :class="$style.wrap">
    <ul :class="$style.colors" role="listbox">
      <li
        v-for="c in props.palette"
        role="option"
        :aria-label="'color:' + c"
        :aria-selected="c.toUpperCase() === pick"
        :key="c"
        :class="{[$style.colorItemWhite]: c === '#FFFFFF', [$style.colorItem]: true }"
        :style="{background: c}"
        @click="handlerClick(c)"
      >
        <div :class="$style.dot" v-show="c.toUpperCase() === pick"></div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
const defaultColors: string[] = [
  '#4D4D4D', '#999999', '#FFFFFF', '#F44E3B', '#FE9200', '#FCDC00',
  '#DBDF00', '#A4DD00', '#68CCCA', '#73D8FF', '#AEA1FF', '#FDA1FF',
  '#333333', '#808080', '#CCCCCC', '#D33115', '#E27300', '#FCC400',
  '#B0BC00', '#68BC00', '#16A5A5', '#009CE0', '#7B64FF', '#FA28FF',
  '#000000', '#666666', '#B3B3B3', '#9F0500', '#C45100', '#FB9E00',
  '#808900', '#194D33', '#0C797D', '#0062B1', '#653294', '#AB149E'
];
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { useTinyColorModel, EmitEventNames, type useTinyColorModelProps } from '../composable/vmodel.ts';

type Props = {
  palette?: string[]
};

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
