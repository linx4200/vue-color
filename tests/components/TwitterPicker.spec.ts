import { expect, test } from 'vitest';
import { render } from 'vitest-browser-vue';
import TwitterPicker from '../../src/components/TwitterPicker.vue';

test('render correctly', async () => {
  const { getByRole } = render(TwitterPicker, {
    props: {
      tinyColor: '#7BDCB5'
    }
  });
  await expect.element(getByRole('option').nth(2)).toHaveAttribute('aria-selected', 'true');
});

test('change color by hex input', async () => {
  const modelValue = { r: 130, g: 140, b: 150, a: 1 };
  const { getByRole, emitted } = render(TwitterPicker, {
    props: {
      modelValue
    }
  });

  const hexInput = getByRole('textbox', { name: 'Hex' });

  await expect.element(hexInput).toHaveValue('828c96');

  // invalid value: ''
  await hexInput.fill('');
  expect(emitted()['update:modelValue']).toBeUndefined();

  // invalid value: 'foo'
  await hexInput.fill('foo');
  expect(emitted()['update:modelValue']).toBeUndefined();

  await hexInput.fill('#32a852');
  expect((emitted()['update:modelValue'][0] as [typeof modelValue])[0]).toStrictEqual({ r: 50, g: 168, b: 82, a: 1 });
});

test('click the swatches and emit event is fired with correct color', async () => {
  const { getByRole, emitted } = render(TwitterPicker, {
    props: {
      modelValue: '#fff'
    }
  });

  const swatches = getByRole('option');
  await swatches.nth(6).click();

  expect((emitted()['update:modelValue'][0] as [string])[0]).toBe('#abb8c3');

  swatches.nth(9).element().dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

  expect((emitted()['update:modelValue'][1] as [string])[0]).toBe('#9900ef');
});