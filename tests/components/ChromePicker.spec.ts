import { expect, test } from 'vitest';
import { render } from 'vitest-browser-vue';
import ChromePicker from '../../src/components/ChromePicker.vue';
import { waitForRerender } from '../tools';

test('props.disableAlpha', async () => {
  const { getByRole } = render(ChromePicker, {
    props: {
      disableAlpha: true
    },
  });
  await expect.element(getByRole('textbox', { name: 'Transparency' })).not.toBeInTheDocument();
  await expect.element(getByRole('slider', { name: 'Transparency' })).not.toBeInTheDocument();

  const picker = getByRole('application', { name: 'Chrome Color Picker' });
  await expect.element(picker).toBeInTheDocument();
  expect(picker.element().querySelector('.vc-checkerboard')).toBeNull();
});

test('props.disableFields', async () => {
  const { getByTestId } = render(ChromePicker, {
    props: {
      disableFields: true
    },
  });
  await expect.element(getByTestId('fields')).not.toBeInTheDocument();
});

test('props.formats', async () => {
  const { getByTestId, getByRole, rerender } = render(ChromePicker, {
    props: {
      formats: [] as Array<'rgb' | 'hex' | 'hsl'>
    },
  });
  await expect.element(getByTestId('fields')).not.toBeInTheDocument();

  rerender({
    // @ts-expect-error test wrong format
    formats: ['a']
  });
  await waitForRerender();
  await expect.element(getByTestId('fields')).not.toBeInTheDocument();

  rerender({
    // @ts-expect-error test wrong format
    formats: ['rgb', 'a']
  });
  await waitForRerender();
  expect(getByTestId('fields').element().children.length).toBe(1);

  rerender({
    formats: ['hex', 'rgb']
  });
  await waitForRerender();
  // hex + rgb + btn
  expect(getByTestId('fields').element().children.length).toBe(3);
  await expect.element(getByRole('textbox', { name: 'Red' })).not.toBeInTheDocument();
  await expect.element(getByRole('textbox', { name: 'Hex' })).toBeVisible();

});

test('toggle button works fine', async () => {
  const { getByRole } = render(ChromePicker, {
    props: {
      modelValue: 'rgba(133, 115, 68, 0.5)'
    }
  });
  const bInput = getByRole('textbox', { name: 'Blue' });
  await expect.element(getByRole('textbox', { name: 'Transparency' })).toBeVisible();
  await expect.element(getByRole('textbox', { name: 'Red' })).toBeVisible();
  await expect.element(getByRole('textbox', { name: 'Green' })).toBeVisible();
  await expect.element(bInput).toBeVisible();

  const btn = getByRole('button', { name: 'Change color format' });
  await btn.click();

  const hexInput = getByRole('textbox', { name: 'Hex' });
  await expect.element(bInput).not.toBeInTheDocument();
  await expect.element(hexInput).toBeVisible();

  await btn.click();
  const hueInput = getByRole('textbox', { name: 'Hue' });
  await expect.element(hexInput).not.toBeInTheDocument();
  await expect.element(hueInput).toBeVisible();
  await expect.element(getByRole('textbox', { name: 'Saturation' })).toBeVisible();
  await expect.element(getByRole('textbox', { name: 'Lightness' })).toBeVisible();
  await expect.element(getByRole('textbox', { name: 'Transparency' })).toBeVisible();

  await btn.click();
  await expect.element(hueInput).not.toBeInTheDocument();
  await expect.element(bInput).toBeVisible();
});

test('change color by rgba inputs', async () => {
  const modelValue = { r: 130, g: 140, b: 150, a: 1 };
  const { getByRole, emitted } = render(ChromePicker, {
    props: {
      modelValue
    }
  });
  const rInput = getByRole('textbox', { name: 'Red' });
  const gInput = getByRole('textbox', { name: 'Green' });
  const bInput = getByRole('textbox', { name: 'Blue' });
  const aInput = getByRole('textbox', { name: 'Transparency' });

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

  // a
  await aInput.fill('0.6');
  expect((emitted()['update:modelValue'][3] as [typeof modelValue])[0]).toStrictEqual({ r: 130, g: 140, b: 150, a: 0.6 });
});

test('change color by hex inputs', async () => {
  const modelValue = { r: 130, g: 140, b: 150, a: 1 };
  const { getByRole, emitted, rerender } = render(ChromePicker, {
    props: {
      modelValue
    }
  });
  // change to hex inputs first
  const btn = getByRole('button', { name: 'Change color format' });
  await btn.click();

  const hexInput = getByRole('textbox', { name: 'Hex' });

  // invalid value: ''
  await hexInput.fill('');
  expect(emitted()['update:modelValue']).toBeUndefined();

  // invalid value: 'foo'
  await hexInput.fill('foo');
  expect(emitted()['update:modelValue']).toBeUndefined();

  await hexInput.fill('#32a852');
  expect((emitted()['update:modelValue'][0] as [typeof modelValue])[0]).toStrictEqual({ r: 50, g: 168, b: 82, a: 1 });

  rerender({
    modelValue: {
      ...modelValue,
      a: 0.5
    }
  });
  await hexInput.fill('#32a85299');
  expect((emitted()['update:modelValue'][1] as [typeof modelValue])[0]).toStrictEqual({ r: 50, g: 168, b: 82, a: 0.6 });
});

test('change color by hsla inputs', async () => {
  const modelValue = { h: 130, s: 0.5, l: 0.5, a: 0.5 };
  const { getByRole, emitted } = render(ChromePicker, {
    props: {
      modelValue
    }
  });
  // change to hsla inputs first
  const btn = getByRole('button', { name: 'Change color format' });
  await btn.click();
  await btn.click();

  const hInput = getByRole('textbox', { name: 'Hue' });
  const sInput = getByRole('textbox', { name: 'Saturation' });
  const lInput = getByRole('textbox', { name: 'Lightness' });
  const aInput = getByRole('textbox', { name: 'Transparency' });

  // invalid value: ''
  await hInput.fill('');
  expect(emitted()['update:modelValue']).toBeUndefined();

  await hInput.fill('200');
  expect((emitted()['update:modelValue'][0] as [typeof modelValue])[0].h).toBeCloseTo(200);

  await sInput.fill('60');
  expect((emitted()['update:modelValue'][1] as [typeof modelValue])[0].s).toBeCloseTo(0.6);

  await lInput.fill('70');
  expect((emitted()['update:modelValue'][2] as [typeof modelValue])[0].l).toBeCloseTo(0.7);

  await aInput.fill('0.8');
  expect((emitted()['update:modelValue'][3] as [typeof modelValue])[0].a).toBeCloseTo(0.8);
});