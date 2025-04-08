import { expect, test } from 'vitest';
import { render } from 'vitest-browser-vue';
import SliderPicker from '../../src/components/SliderPicker.vue';
import { waitForRerender } from '../tools';

test('render with various swatches and props.alpha', async () => {
  const { getByRole, rerender } = render(SliderPicker, {
    props: {
      swatches: ['0.1', '0.4', '0.7']
    } as { swatches?: ({ s: number, l: number} | string)[], alpha?: boolean }
  });
  expect(getByRole('option').elements().length).toBe(3);
  await expect.element(getByRole('slider', { name: 'Transparency' })).not.toBeInTheDocument();

  rerender({
    swatches: [{ s: 0.1, l: 0.2 }, { s: 0.1, l: 0.4 }, { s: 0.1, l: 0.6 }, { s: 0.1, l: 0.8 }]
  });
  await waitForRerender();

  expect(getByRole('option').elements().length).toBe(4);

  rerender({
    swatches: []
  });
  await waitForRerender();
  await expect.element(getByRole('listbox')).not.toBeInTheDocument();

  rerender({
    alpha: true
  });
  await waitForRerender();
  await expect.element(getByRole('slider', { name: 'Transparency' })).toBeInTheDocument();
});

test('render with certain inputs', async () => {
  const { getByRole, rerender } = render(SliderPicker, {
    props: {
      modelValue: { s: 0.5005, l: 0.8005, h: 100 }
    }
  });
  await expect.element(getByRole('option').nth(0)).toHaveAttribute('aria-selected', 'true');

  rerender({
    modelValue: { s: 0.5005, l: 1, h: 100 },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    swatches: ['0.5', '1']
  });
  await waitForRerender();
  await expect.element(getByRole('option').nth(1)).toHaveAttribute('aria-selected', 'true');

  rerender({
    modelValue: { s: 0.5005, l: 0, h: 100 },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    swatches: ['0.5', '1', '0']
  });
  await waitForRerender();
  await expect.element(getByRole('option').nth(2)).toHaveAttribute('aria-selected', 'true');
});

test('click the swatches and emit event is fired with correct color', async () => {
  const { getByRole, emitted } = render(SliderPicker, {
    props: {
      modelValue: {
        h: 120,
        s: 0.1,
        l: 0.1
      }
    }
  });

  const swatches = getByRole('option');
  await swatches.nth(1).click();

  const emittedColor1 = (emitted()['update:modelValue'][0] as [{ h: number, s: number, l: number }])[0];
  expect(emittedColor1.h).toBeCloseTo(120);
  expect(emittedColor1.s).toBeCloseTo(0.5);
  expect(emittedColor1.l).toBeCloseTo(0.65);

  swatches.nth(3).element().dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

  const emittedColor2 = (emitted()['update:modelValue'][1] as [{ h: number, s: number, l: number }])[0];
  expect(emittedColor2.h).toBeCloseTo(120);
  expect(emittedColor2.s).toBeCloseTo(0.5);
  expect(emittedColor2.l).toBeCloseTo(0.35);
});