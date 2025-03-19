import { expect, test } from 'vitest';
import { render } from 'vitest-browser-vue';
import GrayscalePicker from '../../src/components/GrayscalePicker.vue';

test('render with different palette', async () => {
  const { getByRole } = render(GrayscalePicker, {
    props: {
      palette: ['#E6E6E6', '#8C8C8C', '#333333'],
      tinyColor: '#E6E6E6'
    }
  });
  const paletteListElE = getByRole('listbox').element();
  expect(paletteListElE.childElementCount).toBe(3);

  await expect.element(getByRole('option').nth(0)).toHaveAttribute('aria-selected', "true");
  await expect.element(getByRole('option').nth(1)).toHaveAttribute('aria-selected', "false");
  await expect.element(getByRole('option').nth(2)).toHaveAttribute('aria-selected', "false");
});

test('click one of the color in the palette', async () => {
  const { getByRole, emitted } = render(GrayscalePicker, {
    props: {
      modelValue: '#E6E6E6'
    }
  });
  const options = getByRole('option');
  await options.nth(3).click();

  expect((emitted()['update:modelValue'][0] as [string])[0]).toBe('#D9D9D9'.toLowerCase());

  // press Space bar
  options.nth(4).element().dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
  expect((emitted()['update:modelValue'][1] as [string])[0]).toBe('#CCCCCC'.toLowerCase());
});