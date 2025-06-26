
import { render, fireEvent } from '@testing-library/vue';
import TwitterPicker from '@components/TwitterPicker.vue';
import { wait } from '../tool';

test('change color by hex input', () => {
  const value = { r: 130, g: 140, b: 150, a: 1 };
  const { getByRole, emitted } = render(TwitterPicker, {
    props: {
      value
    }
  });

  const hexInput = getByRole('textbox', { name: 'Hex' });

  expect((hexInput as HTMLInputElement).value).toBe('828c96');

  fireEvent.update(hexInput, '#32a852');
  expect((emitted()['input'][0] as [typeof value])[0]).toStrictEqual({ r: 50, g: 168, b: 82, a: 1 });
});

test('click the swatches and emit event is fired with correct color', async () => {
  const { getAllByRole, emitted } = render(TwitterPicker, {
    props: {
      value: '#fff'
    }
  });

  const swatches = getAllByRole('option');
  swatches[6].click();
  await wait();

  expect((emitted()['input'][0] as [string])[0]).toBe('#abb8c3');
});