import { expect, test } from 'vitest';
import { render } from 'vitest-browser-vue';
import Hue from '../../src/components/HueSlider.vue';

test('The background color of the picker', async () => {
  const { getByRole } = render(Hue, {
    props: {
      modelValue: 66,
      direction: 'horizontal',
    },
  });

  const sliderElement = getByRole('slider').element() as HTMLElement;
  const pickerElement = sliderElement.querySelectorAll('div')?.[1];

  const bgColor = window.getComputedStyle(pickerElement, null).getPropertyValue('background-color');

  expect(bgColor).toBe('rgb(230, 255, 0)');
});

test('The class should be passed down to the inner Hue Slider', async () => {
  const { getByRole } = render(Hue, {
    props: {
      modelValue: 99,
      direction: 'vertical',
      class: 'test-class'
    },
  });

  const sliderElement = getByRole('slider').element() as HTMLElement;
  expect(sliderElement.classList.contains('vertical')).toBe(true);
  expect(sliderElement.parentElement?.classList.contains('test-class')).toBe(true);
});
