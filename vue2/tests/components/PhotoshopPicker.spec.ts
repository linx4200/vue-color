
import { render, fireEvent } from '@testing-library/vue';
import PhotoshopPicker from '@components/PhotoshopPicker.vue';
import { wait } from '../tool';

test('change back to current color', async () => {
  const { getByRole, emitted } = render(PhotoshopPicker, {
    props: {
      value: '#536da3',
      currentColor: '#333'
    }
  });
  const btn = getByRole('button', { name: 'Current color is #333' });
  btn.click();
  await wait();
  expect((emitted()['input'][0] as [string])[0]).toBe('#333333');
});

test('change color by hex inputs', async () => {
  const value = { r: 130, g: 140, b: 150, a: 1 };
  const { getByRole, emitted } = render(PhotoshopPicker, {
    props: {
      value
    }
  });

  const hexInput = getByRole('textbox', { name: 'Hex' });

  fireEvent.update(hexInput, '#32a852');
  expect(emitted()['input'][0][0]).toStrictEqual({ r: 50, g: 168, b: 82, a: 1 });
});