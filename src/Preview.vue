<script setup lang="ts">
import { defineModel, effectScope, watch, ref } from 'vue';

import Checkerboard from './components/common/Checkerboard.vue';
import Alpha from './components/common/Alpha.vue';
import EditableInput from './components/common/EditableInput.vue';

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
  <div class="alpha-container">
    <Alpha v-model:tinyColor='color' />
  </div>
  <div>Editable Input: {{inputValue}} </div>
  <div><EditableInput label="r" desc="abc" :value="inputValue" @change="(value) => inputValue = value" :max="5" :min="1" /></div>
</template>

<style scoped>
.checkerboard-container {
  width: 500px;
  height: 20px;
  position: relative;
}

.alpha-container {
  width: 500px;
  height: 10px;
  position: relative;
}
</style>
