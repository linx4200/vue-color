
import { render, fireEvent } from '@testing-library/vue';
import SketchPicker from '@components/SketchPicker.vue';
import { wait } from '../tool';

test('change color by alpha input', async () => {
  const value = { r: 130, g: 140, b: 150, a: 1 };
  const { getByRole, emitted } = render(SketchPicker, {
    props: {
      value
    }
  });
  const alphaInput = getByRole('textbox', { name: 'Transparency' });

  fireEvent.update(alphaInput, '0.3');
  expect(emitted()['input'][0][0]).toStrictEqual({ r: 130, g: 140, b: 150, a: 0.3 });
});

test('change color by clicking preset color', async () => {
  const { getAllByRole, emitted } = render(SketchPicker, {
    props: {
      value: '#fff'
    }
  });

  const presetColors = getAllByRole('option');

  presetColors[presetColors.length - 1].click();
  await wait();
  expect(emitted()['input'][0][0]).toBe('#00000000');
});