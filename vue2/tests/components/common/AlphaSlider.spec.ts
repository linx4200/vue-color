import { render, screen } from '@testing-library/vue';
import Alpha from '@components/common/AlphaSlider.vue';

test('picker should reflect alpha value', () => {
  render(Alpha, {
    props: {
      modelValue: { r: 100, g: 100, b: 100, a: 0.3 },
    },
  });

  const slider = screen.getByRole('slider');
  const picker = slider.querySelector('div');
  expect(picker?.style.left).toBe('30%');
});
