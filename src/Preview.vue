<script setup lang="ts">
import { defineModel, effectScope, watch, ref } from 'vue';

import Checkerboard from './components/common/Checkerboard.vue';
import Alpha from './components/common/Alpha.vue';
import EditableInput from './components/common/EditableInput.vue';
import Hue from './components/common/Hue.vue';
import Saturation from './components/common/Saturation.vue';

const color = defineModel({
  default: 'red'
});

const inputValue = ref(1);

const scope = effectScope();

scope.run(() => {
  watch(color, () => console.log('Preview color ===>', color.value));
})

</script>

<template>
  <div>Checkerboard</div>
  <div class="checkerboard-container">
    <Checkerboard />
  </div>

  <div>Alpha</div>
  <div class="common-container">
    <Alpha v-model:tinyColor='color' />
  </div>

  <div>Editable Input: {{inputValue}} </div>
  <div><EditableInput label="r" desc="abc" :value="inputValue" @change="(value) => inputValue = value" :max="5" :min="1" /></div>

  <div>Hue</div>
  <div class="common-container"><Hue direction="horizontal" v-model:tinyColor="color" /></div>

  <div>Saturation</div>
  <div class="saturation-container"><Saturation v-model:tiny-color="color"/></div>
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
