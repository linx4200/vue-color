import { expect, test } from 'vitest';
import { render } from 'vitest-browser-vue';
import CompactPicker from '../../src/components/CompactPicker.vue';

test('render with different palette', async () => {
  const { getByRole } = render(CompactPicker, {
    props: {
      palette: ['#a83292', '#a8ff92', '#263d1e'],
      tinyColor: '#a83292'
    }
  });
  const paletteListElE = getByRole('listbox').element();
  expect(paletteListElE.childElementCount).toBe(3);

  await expect.element(getByRole('option').nth(0)).toHaveAttribute('aria-selected', "true");
  await expect.element(getByRole('option').nth(1)).toHaveAttribute('aria-selected', "false");
  await expect.element(getByRole('option').nth(2)).toHaveAttribute('aria-selected', "false");
});

test('click one of the color in the palette', async () => {
  const { getByRole, emitted } = render(CompactPicker, {
    props: {
      modelValue: '#a83292'
    }
  });
  const options = getByRole('option');
  await options.nth(3).click();

  expect((emitted()['update:modelValue'][0] as [string])[0]).toBe('#F44E3B'.toLowerCase());

  // press Space bar
  options.nth(4).element().dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
  expect((emitted()['update:modelValue'][1] as [string])[0]).toBe('#FE9200'.toLowerCase());
});