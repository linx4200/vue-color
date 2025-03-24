<template>
  <div role="application" aria-label="Swatches color picker" :class="$style.wrap" :data-pick="hex">
    <div :class="$style.box" role="listbox" aria-label="Pick a color" tabindex="0">
      <div :class="$style.colorGroup" v-for="(group, $idx) in palette" :key="$idx">
        <div
          :class="[$style.color, {[$style.colorWhite]: c === '#FFFFFF' }]"
          v-for="c in group" :key="c"
          :data-color="c"
          :style="{background: c}"
          @click="handlerClick(c)"
          role="option"
          :aria-label="'Color:' + c"
          :aria-selected="equal(c)"
          @keydown.space="handlerClick(c)"
          tabindex="0"
        >
          <div :class="$style.pick" v-show="equal(c)">
            <svg style="width: 24px; height:24px;" viewBox="0 0 24 24">
              <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import material from 'material-colors';
import type colors from 'material-colors';

const colorMap = [
  'red', 'pink', 'purple', 'deepPurple',
  'indigo', 'blue', 'lightBlue', 'cyan',
  'teal', 'green', 'lightGreen', 'lime',
  'yellow', 'amber', 'orange', 'deepOrange',
  'brown', 'blueGrey', 'black'
] as Array<keyof typeof colors>;

const intensity = ['900', '700', '500', '300', '100'] as Array<keyof typeof colors['red']>;

const defaultColors = /*#__PURE__*/ (() => {
  const colors: string[][] = [];
  colorMap.forEach((type) => {
    let typeColor: string[] = []
    if (type.toLowerCase() === 'black' || type.toLowerCase() === 'white') {
      typeColor = typeColor.concat(['#000000', '#FFFFFF'])
    } else {
      intensity.forEach((level) => {
        const color = (material[type] as unknown as Record<string, string>)[level];
        typeColor.push(color.toUpperCase());
      })
    }
    colors.push(typeColor)
  })
  return colors
})()
</script>

<script setup lang="ts">
import { useTinyColorModel, EmitEventNames ,type useTinyColorModelProps } from '../composable/vmodel';
import { computed } from 'vue';

type Props = {
  palette?: string[][];
}

const props = withDefaults(defineProps<useTinyColorModelProps & Props>(), {
  palette: () => defaultColors
});
const emit = defineEmits(EmitEventNames);

const { colorRef: tinyColorRef, updateColor: updateTinyColor } = useTinyColorModel(props, emit);

const hex = computed(() => tinyColorRef.value.toHexString());

const equal = (color: string) => {
  return color.toLowerCase() === hex.value.toLowerCase();
};

const handlerClick = (hex: string) => {
  updateTinyColor(hex);
}
</script>

<style module>
.wrap {
  width: 320px;
  height: 240px;
  overflow-y: scroll;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,.12), 0 2px 5px rgba(0,0,0,.16);
 }
.box {
  padding: 16px 0 6px 16px;
  overflow: hidden;
}
.colorGroup {
  padding-bottom: 10px;
  width: 40px;
  float: left;
  margin-right: 10px;
}
.color {
  box-sizing: border-box;
  width: 40px;
  height: 24px;
  cursor: pointer;
  background: #880e4f;
  margin-bottom: 1px;
  overflow: hidden;
  -ms-border-radius: 2px 2px 0 0;
  -moz-border-radius: 2px 2px 0 0;
  -o-border-radius: 2px 2px 0 0;
  -webkit-border-radius: 2px 2px 0 0;
  border-radius: 2px 2px 0 0;
}
.colorWhite {
  border: 1px solid #DDD;
}
.pick {
  fill: rgb(255, 255, 255);
  margin-left: 8px;
  display: block;
}
.colorWhite .pick {
  fill: rgb(51, 51, 51);
}
</style>
