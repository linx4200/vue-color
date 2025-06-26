
import { render } from '@testing-library/vue';
import Hue from '@components/HueSlider.vue';
import { mockClickPosition } from '../tool';

test('click and response with right value', async () => {
  const { getByRole, emitted } = render(Hue, {
    props: {
      value: 66
    },
  });

  const container = getByRole('slider');

  mockClickPosition({ container, left: 0.3});
  expect(emitted()['input'][0][0]).toBeCloseTo(108);
});

test('The class should be passed down to the inner Hue Slider', async () => {
  const { getByRole } = render(Hue, {
    props: {
      modelValue: 99,
      direction: 'vertical',
      class: 'test-class'
    },
  });

  const sliderElement = getByRole('slider');
  expect(sliderElement.classList.contains('vertical')).toBe(true);
  expect(sliderElement.parentElement?.classList.contains('test-class')).toBe(true);
});
