import { expect, test } from 'vitest';
import { render } from 'vitest-browser-vue';
import SketchPicker from '../../src/components/SketchPicker.vue';
import { waitForRerender } from '../tools';

test('render with `props.disableAlpha = true`', async () => {
  const { getByRole } = render(SketchPicker, {
    props: {
      disableAlpha: true
    }
  });
  await expect.element(getByRole('textbox', { name: 'Transparency' })).not.toBeInTheDocument();
  await expect.element(getByRole('slider', { name: 'Transparency' })).not.toBeInTheDocument();
});

test('render with `props.disableFields = true`', async () => {
  const { getByRole } = render(SketchPicker, {
    props: {
      disableFields: true
    }
  });
  await expect.element(getByRole('textbox', { name: 'Hex' })).not.toBeInTheDocument();
  await expect.element(getByRole('textbox', { name: 'Red' })).not.toBeInTheDocument();
  await expect.element(getByRole('textbox', { name: 'Green' })).not.toBeInTheDocument();
  await expect.element(getByRole('textbox', { name: 'Transparency' })).not.toBeInTheDocument();
});

test('render correctly with certain input', async () => {
  const { getByRole, getByLabelText, rerender } = render(SketchPicker, {
    props: {
      modelValue: { r: 64, g: 64, b: 191, a: 1 }
    }
  });
  expect(getByRole('textbox', { name: 'Hex' }).element()).toHaveValue('4040bf');
  expect(getByRole('textbox', { name: 'Red' }).element()).toHaveValue('64');
  expect(getByRole('textbox', { name: 'Green' }).element()).toHaveValue('64');
  expect(getByRole('textbox', { name: 'Blue' }).element()).toHaveValue('191');
  expect(getByRole('textbox', { name: 'Transparency' }).element()).toHaveValue('1');

  expect(getByLabelText('Current color is').element().getAttribute('style')).toBe('background: rgb(64, 64, 191);');

  rerender({
    modelValue: { r: 66, g: 245, b: 176, a: 0.5 }
  });
  await waitForRerender();
  expect(getByRole('textbox', { name: 'Hex' }).element()).toHaveValue('42f5b080');
});

test('change color by rgb inputs', async () => {
  const modelValue = { r: 130, g: 140, b: 150, a: 1 };
  const { getByRole, emitted } = render(SketchPicker, {
    props: {
      modelValue
    }
  });
  const rInput = getByRole('textbox', { name: 'Red' });
  const gInput = getByRole('textbox', { name: 'Green' });
  const bInput = getByRole('textbox', { name: 'Blue' });

  // invalid value: ''
  await rInput.fill('');
  expect(emitted()['update:modelValue']).toBeUndefined();

  // invalid value: string
  await rInput.fill('foo');
  expect(emitted()['update:modelValue']).toBeUndefined();

  // r
  await rInput.fill('135');
  expect((emitted()['update:modelValue'][0] as [typeof modelValue])[0]).toStrictEqual({ r: 135, g: 140, b: 150, a: 1 });

  // g
  await gInput.fill('145');
  expect((emitted()['update:modelValue'][1] as [typeof modelValue])[0]).toStrictEqual({ r: 130, g: 145, b: 150, a: 1 });

  // b
  await bInput.fill('155');
  expect((emitted()['update:modelValue'][2] as [typeof modelValue])[0]).toStrictEqual({ r: 130, g: 140, b: 155, a: 1 });
});

test('change color by hex inputs', async () => {
  const modelValue = { r: 130, g: 140, b: 150, a: 1 };
  const { getByRole, emitted } = render(SketchPicker, {
    props: {
      modelValue
    }
  });

  const hexInput = getByRole('textbox', { name: 'Hex' });

  // invalid value: ''
  await hexInput.fill('');
  expect(emitted()['update:modelValue']).toBeUndefined();

  // invalid value: 'foo'
  await hexInput.fill('foo');
  expect(emitted()['update:modelValue']).toBeUndefined();

  await hexInput.fill('#32a852');
  expect((emitted()['update:modelValue'][0] as [typeof modelValue])[0]).toStrictEqual({ r: 50, g: 168, b: 82, a: 1 });
});

test('change color by alpha input', async () => {
  const modelValue = { r: 130, g: 140, b: 150, a: 1 };
  const { getByRole, emitted } = render(SketchPicker, {
    props: {
      modelValue
    }
  });
  const alphaInput = getByRole('textbox', { name: 'Transparency' });

  // invalid value: ''
  await alphaInput.fill('');
  expect(emitted()['update:modelValue']).toBeUndefined();

  // invalid value: string
  await alphaInput.fill('foo');
  expect(emitted()['update:modelValue']).toBeUndefined();

  await alphaInput.fill('0.3');
  expect((emitted()['update:modelValue'][0] as [typeof modelValue])[0]).toStrictEqual({ r: 130, g: 140, b: 150, a: 0.3 });
});

test('change color by clicking preset color', async () => {
  const { getByRole, emitted } = render(SketchPicker, {
    props: {
      modelValue: '#fff'
    }
  });

  const presetColors = getByRole('option');
  await presetColors.nth(5).click();

  expect((emitted()['update:modelValue'][0] as [string])[0]).toBe('#417505');

  await presetColors.last().click();
  expect((emitted()['update:modelValue'][1] as [string])[0]).toBe('#000000');

  presetColors.nth(10).element().dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
  expect((emitted()['update:modelValue'][2] as [string])[0]).toBe('#b8e986');

  presetColors.last().element().dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
  expect((emitted()['update:modelValue'][3] as [string])[0]).toBe('#000000');
});