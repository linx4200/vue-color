<script setup lang="ts">
import { defineModel, effectScope, watch, ref, reactive } from 'vue';

import Checkerboard from './components/common/Checkerboard.vue';
import Alpha from './components/common/Alpha.vue';
import EditableInput from './components/common/EditableInput.vue';
import Hue from './components/common/Hue.vue';
import Saturation from './components/common/Saturation.vue';

import Chrome from './components/Chrome.vue';
import Compact from './components/Compact.vue';
import Grayscale from './components/Grayscale.vue';
import Material from './components/Material.vue';
import Photoshop from './components/Photoshop.vue';
import Sketch from './components/Sketch.vue';
import Slider from './components/Slider.vue';
import Twitter from './components/Twitter.vue';

const tinyColor = defineModel('tinycolor', {
  default: 'blue'
});

const colorRGBA = defineModel({
  default: () => reactive({r: 0, g: 0, b: 255, a: 1})
});

const inputValue = ref(1);

const scope = effectScope();

scope.run(() => {
  watch(tinyColor, () => console.log('Preview tinyColor ===>', tinyColor.value));
})

</script>

<template>
  <div>{{ colorRGBA }}</div>

  <br />

  <div>Checkerboard</div>
  <div class="checkerboard-container">
    <Checkerboard />
  </div>

  <div>Alpha</div>
  <div class="common-container">
    <Alpha v-model:tinyColor='tinyColor' v-model="colorRGBA" />
  </div>

  <div>Editable Input: {{inputValue}} </div>
  <div><EditableInput label="r" desc="abc" :value="inputValue" @change="(value) => inputValue = value" :max="5" :min="1" /></div>

  <!-- <div>Hue</div>
  <div class="common-container"><Hue direction="horizontal" /></div> -->

  <div>Saturation</div>
  <div class="saturation-container"><Saturation v-model:tinyColor="tinyColor" v-model="colorRGBA" /></div>

  <div>Chrome</div>
  <div><Chrome v-model:tinyColor="tinyColor" v-model="colorRGBA" /></div>

  <div>Compact</div>
  <div><Compact v-model:tinyColor="tinyColor" v-model="colorRGBA" /></div>

  <div>Grayscale</div>
  <div><Grayscale v-model:tinyColor="tinyColor" v-model="colorRGBA" /></div>

  <div>Material</div>
  <div><Material v-model:tinyColor="tinyColor" v-model="colorRGBA" /></div>

  <div>Photoshop</div>
  <div><Photoshop v-model:tinyColor="tinyColor" v-model="colorRGBA" /></div>

  <div>Sketch</div>
  <div><Sketch v-model:tinyColor="tinyColor" v-model="colorRGBA" /></div>

  <div>Slider</div>
  <div><Slider v-model:tinyColor="tinyColor" v-model="colorRGBA" /></div>

  <div>Twitter</div>
  <div><Twitter v-model:tinyColor="tinyColor" v-model="colorRGBA" /></div>
</template>

<style scoped>
.checkerboard-container {
  width: 500px;
  height: 20px;
  position: relative;
}

.common-container {
  width: 500px;
  height: 10px;
  position: relative;
}

.saturation-container {
  width: 100px;
  height: 100px;
  position: relative;
}
</style>
