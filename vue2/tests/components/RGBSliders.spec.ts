
import { render, fireEvent } from '@testing-library/vue';
import RGBSliders from '@components/RGBSliders.vue';
import { mockClickPosition } from '../tool';

test('click the slider and input and emit event is fired with correct color', async () => {
  const { getByRole, emitted } = render(RGBSliders, {
    props: {
      value: {
        r: 60,
        g: 18,
        b: 222
      }
    }
  });

  const slider = getByRole('slider', { name: 'red' });
  mockClickPosition({container: slider, left: 0.5});

  expect(emitted()['input'][0][0].r).toBeCloseTo(128);
  expect(emitted()['input'][0][0].g).toBeCloseTo(18);
  expect(emitted()['input'][0][0].b).toBeCloseTo(222);

  const input = getByRole('textbox', { name: 'green' });
  fireEvent.update(input, '80');

  expect(emitted()['input'][1][0].r).toBeCloseTo(60);
  expect(emitted()['input'][1][0].g).toBeCloseTo(80);
  expect(emitted()['input'][1][0].b).toBeCloseTo(222);
});