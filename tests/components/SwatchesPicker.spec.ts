import { expect, test } from 'vitest';
import { render } from 'vitest-browser-vue';
import SwatchesPicker from '../../src/components/SwatchesPicker.vue';

test('render with other palette', async () => {
  const { getByRole } = render(SwatchesPicker, {
    props: {
      palette: [['#4f64f2', '#927c91', '#d05e66'],
      ['#849520', '#8f02cc', '#9c6f3d'],
      ['#6aaefe', '#cd5a75', '#9b0d6b']],
      tinyColor: '#cd5a75'
    }
  });

  expect(getByRole('option').elements().length).toBe(9);
  await expect.element(getByRole('option').nth(7)).toHaveAttribute('aria-selected', 'true');
});

test('click the swatches and emit event is fired with correct color', async () => {
  const { getByRole, emitted } = render(SwatchesPicker, {
    props: {
      modelValue: '#fff'
    }
  });

  const swatches = getByRole('option');
  await swatches.nth(3).click();

  expect((emitted()['update:modelValue'][0] as [string])[0]).toBe('#e57373');

  swatches.nth(6).element().dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

  expect((emitted()['update:modelValue'][1] as [string])[0]).toBe('#c2185b');
});