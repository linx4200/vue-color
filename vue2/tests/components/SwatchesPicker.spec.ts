
import { render } from '@testing-library/vue';
import SwatchesPicker from '@components/SwatchesPicker.vue';
import { wait } from '../tool';

test('click the swatches and emit event is fired with correct color', async () => {
  const { getAllByRole, emitted } = render(SwatchesPicker, {
    props: {
      value: '#fff'
    }
  });

  const swatches = getAllByRole('option');
  swatches[3].click();

  await wait();

  expect((emitted()['input'][0] as [string])[0]).toBe('#e57373');
});