
import { render, fireEvent } from '@testing-library/vue';
import HSVSliders from '@components/HSVSliders.vue';
import { mockClickPosition } from '../tool';

test('click the slider and input and emit event is fired with correct color', async () => {
  const { getByRole, emitted } = render(HSVSliders, {
    props: {
      value: {
        h: 120,
        s: 0.1,
        v: 0.1
      }
    }
  });

  const slider = getByRole('slider', { name: 'brightness' });
  mockClickPosition({container: slider, left: 0.5});

  expect(emitted()['input'][0][0].h).toBeCloseTo(120);
  expect(emitted()['input'][0][0].v).toBeCloseTo(0.5);

  const brightnessInput = getByRole('textbox', { name: 'brightness' });
  fireEvent.update(brightnessInput, '80');

  expect(emitted()['input'][1][0].v).toBeCloseTo(0.8);

  const alphaSlider = getByRole('slider', { name: 'Transparency' });
  mockClickPosition({container: alphaSlider, left: 0.9});
  expect(emitted()['input'][2][0].a).toBeCloseTo(0.9);

  const alphaInput = getByRole('textbox', { name: 'alpha' });
  fireEvent.update(alphaInput, '0.1');

  expect(emitted()['input'][3][0].v).toBeCloseTo(0.1);
});