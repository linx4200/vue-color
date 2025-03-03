<template>
  <div :class="['vc-editable-input', $style.wrapper]">
    <input
      :class="['vc-input-input', $style.input]"
      :value="props.value"
      @keydown="handleKeyDown"
      @input="handleInput"
      :aria-label="ariaLabel"
    >
    <label :for="label" :class="['vc-input-label', $style.label]">{{props.label}}</label>
    <span v-if="!!desc" class="vc-input-desc">{{desc}}</span>
  </div>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue';
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

const attrs = useAttrs();

const ariaLabel = attrs['aria-label'] as string ?? props.label;

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

<style module>
.wrapper {
  position: relative;
}
.input {
  padding: 0;
  border: 0;
  outline: none;
}
.label {
  text-transform: capitalize;
}
</style>
