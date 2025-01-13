<template>
  <div class="vc-editable-input">
    <input
      :aria-labelledby="labelId"
      class="vc-input__input"
      :value="props.value"
      @keydown="handleKeyDown"
      @input="handleInput"
    >
    <span :for="label" class="vc-input__label" :id="labelId">{{props.label}}</span>
    <span class="vc-input__desc" v-show="!!desc">{{desc}}</span>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { getFractionDigit } from '../../utils/math';

type Props = {
  value: string | number;
  label: string;
  desc?: string;
  max?: number;
  min?: number;
  step?: number;
}

const props = withDefaults(defineProps<Props>(), {
  step: 1
});

const emit = defineEmits(['change']);

const labelId = ref(`input__label__${props.label}__${Math.random().toString().slice(2, 5)}`);

function update (newVal: number | string) {
  if (props.max && +newVal > props.max) {
    emit('change', props.max);
    return;
  }
  if (props.min && +newVal < props.min) {
    emit('change', props.min);
    return;
  }
  emit('change', newVal);
}

function handleInput (e: Event) {
  update((e.target as HTMLInputElement)?.value);
}

// **** unused
// function handleBlur (e) {
//   console.log(e)
// }

function handleKeyDown (e: KeyboardEvent) {
  let number = Number(props.value);
  if (!isNaN(number)) {
    let step = props.step;
    const fractionDigit = getFractionDigit(step);

    // Up
    if (e.code === 'ArrowUp' || e.keyCode === 38) {
      update((number + step).toFixed(fractionDigit));
      e.preventDefault();
    }

    // Down
    if (e.code === 'ArrowDown' || e.keyCode === 40) {
      update((number - step).toFixed(fractionDigit));
      e.preventDefault();
    }
  }
}

// **** unused
// function handleDrag (e) {
//   console.log(e)
// },
// function handleMouseDown (e) {
//   console.log(e)
// }
</script>

<style>
.vc-editable-input {
  position: relative;
}
.vc-input__input {
  padding: 0;
  border: 0;
  outline: none;
}
.vc-input__label {
  text-transform: capitalize;
}
</style>
