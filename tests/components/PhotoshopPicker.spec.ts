import { expect, test } from 'vitest';
import { render } from 'vitest-browser-vue';
import PhotoshopPicker from '../../src/components/PhotoshopPicker.vue';

test('render correctly (props.disableFields = true)', async () => {
  const { getByRole } = render(PhotoshopPicker, {
    props: {
      disableFields: true
    }
  })
  expect(getByRole('textbox').elements()).toEqual([]);
});

test('render correctly (props.hasResetButton = true)', async () => {
  const { getByRole } = render(PhotoshopPicker, {
    props: {
      hasResetButton: true
    }
  })
  await expect.element(getByRole('button', { name: 'reset' })).toBeInTheDocument();
});

test('render correctly with givin color', async () => {
  const { getByLabelText, getByRole } = render(PhotoshopPicker, {
    props: {
      tinyColor: '#536da3',
      initialColor: '#000'
    }
  });

  await expect.element(getByRole('textbox', { name: 'Hue' })).toHaveValue('220');
  await expect.element(getByRole('textbox', { name: 'Saturation' })).toHaveValue('49');
  await expect.element(getByLabelText('Value')).toHaveValue('64');
  await expect.element(getByLabelText('Red')).toHaveValue('83');
  await expect.element(getByLabelText('Green')).toHaveValue('109');
  await expect.element(getByLabelText('Blue')).toHaveValue('163');
  await expect.element(getByLabelText('Hex')).toHaveValue('536da3');

  expect(getByLabelText('New color is').element().getAttribute('style')).toBe('background: rgb(83, 109, 163);');
  expect(getByRole('button', { name: 'Current color is' }).element().getAttribute('style')).toBe('background: rgb(255, 255, 255);');
});

test('change back to current color', async () => {
  const { getByRole, emitted } = render(PhotoshopPicker, {
    props: {
      modelValue: '#536da3',
      currentColor: '#333'
    }
  });
  const btn = getByRole('button', { name: 'Current color is' });
  await btn.click();
  expect((emitted()['update:modelValue'][0] as [string])[0]).toBe('#333333');
});

test('buttons work fine', async () => {
  const { getByLabelText, emitted } = render(PhotoshopPicker, {
    props: {
      hasResetButton: true
    }
  });

  const okBtn = getByLabelText('Click to apply');
  await okBtn.click();
  expect(emitted()['ok'][0]).not.toBeUndefined();

  const cancelBtn = getByLabelText('Cancel');
  await cancelBtn.click();
  expect(emitted()['cancel'][0]).not.toBeUndefined();

  const resetBtn = getByLabelText('Reset');
  await resetBtn.click();
  expect(emitted()['reset'][0]).not.toBeUndefined();
});

test('change color by rgba inputs', async () => {
  const modelValue = { r: 130, g: 140, b: 150, a: 1 };
  const { getByRole, emitted } = render(PhotoshopPicker, {
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
  const { getByRole, emitted } = render(PhotoshopPicker, {
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

test('change color by hsv inputs', async () => {
  const modelValue = { h: 130, s: 0.5, v: 0.5, a: 0.5 };
  const { getByRole, emitted } = render(PhotoshopPicker, {
    props: {
      modelValue
    }
  });

  const hInput = getByRole('textbox', { name: 'Hue' });
  const sInput = getByRole('textbox', { name: 'Saturation' });
  const vInput = getByRole('textbox', { name: 'Value' });

  // invalid value: ''
  await hInput.fill('');
  expect(emitted()['update:modelValue']).toBeUndefined();

  // invalid value: 'foo'
  await hInput.fill('foo');
  expect(emitted()['update:modelValue']).toBeUndefined();

  await hInput.fill('200');
  expect((emitted()['update:modelValue'][0] as [typeof modelValue])[0].h).toBeCloseTo(200);

  await sInput.fill('60');
  expect((emitted()['update:modelValue'][1] as [typeof modelValue])[0].s).toBeCloseTo(0.6);

  await vInput.fill('70');
  expect((emitted()['update:modelValue'][2] as [typeof modelValue])[0].v).toBeCloseTo(0.7);
});