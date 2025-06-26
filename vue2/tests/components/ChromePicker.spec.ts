import { render, fireEvent } from '@testing-library/vue';
import ChromePicker from '@components/ChromePicker.vue';
import { wait } from '../tool';

test('change color by hex inputs', async () => {
  const value = { r: 130, g: 140, b: 150, a: 1 };
  const { getByRole, emitted } = render(ChromePicker, {
    props: {
      value
    }
  });

  // change to hex inputs first
  const btn = getByRole('button', { name: 'Change color format' });
  fireEvent.click(btn);

  // wait for click event to take effect
  await wait();

  const hexInput = getByRole('textbox', { name: 'Hex' });

  fireEvent.update(hexInput, '#32a85299');

  expect(emitted()['input'][0][0]).toStrictEqual({ r: 50, g: 168, b: 82, a: 0.6 });
});
