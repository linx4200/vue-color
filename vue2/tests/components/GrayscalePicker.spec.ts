import { render } from '@testing-library/vue';
import GrayscalePicker from '@components/GrayscalePicker.vue';
import { wait } from '../tool';


test('click one of the color in the palette', async () => {
  const { getAllByRole, emitted } = render(GrayscalePicker, {
    props: {
      value: '#E6E6E6'
    }
  });
  const options = getAllByRole('option');
  options[3].click();

  await wait();

  expect((emitted()['input'][0] as [string])[0]).toBe('#D9D9D9'.toLowerCase());
});