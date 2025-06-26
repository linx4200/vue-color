
import { render } from '@testing-library/vue';
import SliderPicker from '@components/SliderPicker.vue';
import { wait } from '../tool';

test('click the swatches and emit event is fired with correct color', async () => {
  const { getAllByRole, emitted } = render(SliderPicker, {
    props: {
      value: {
        h: 120,
        s: 0.1,
        l: 0.1
      }
    }
  });

  const swatches = getAllByRole('option');
  swatches[1].click();

  await wait();

  const emittedColor = (emitted()['input'][0] as [{ h: number, s: number, l: number }])[0];
  expect(emittedColor.h).toBeCloseTo(120);
  expect(emittedColor.s).toBeCloseTo(0.5);
  expect(emittedColor.l).toBeCloseTo(0.65);
});