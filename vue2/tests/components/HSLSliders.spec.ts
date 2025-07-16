
import { render, fireEvent } from '@testing-library/vue';
import HSLSliders from '@components/HSLSliders.vue';
import { mockClickPosition } from '../tool';

test('click the slider and input and emit event is fired with correct color', async () => {
  const { getByRole, emitted } = render(HSLSliders, {
    props: {
      value: {
        h: 120,
        s: 0.1,
        l: 0.1
      }
    }
  });

  const slider = getByRole('slider', { name: 'saturation' });
  mockClickPosition({container: slider, left: 0.5})

  expect(emitted()['input'][0][0].h).toBeCloseTo(120);
  expect(emitted()['input'][0][0].s).toBeCloseTo(0.5);

  const hueInput = getByRole('textbox', { name: 'hue' });
  fireEvent.update(hueInput, '300');

  expect(emitted()['input'][1][0].h).toBeCloseTo(300);
});