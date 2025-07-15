import { expect, test } from 'vitest';
import { render } from 'vitest-browser-vue';
import HSLSliders from '../../src/components/HSLSliders.vue';

// Test disableAlpha prop hides alpha slider and input

test('props.disableAlpha', async () => {
  const { getByRole } = render(HSLSliders, {
    props: {
      disableAlpha: true,
    },
  });
  await expect.element(getByRole('textbox', { name: 'alpha' })).not.toBeInTheDocument();
  await expect.element(getByRole('slider', { name: 'alpha' })).not.toBeInTheDocument();
});

// Test disableFields prop hides inputs

test('props.disableFields', async () => {
  const { getByRole } = render(HSLSliders, {
    props: {
      disableFields: true,
    },
  });
  await expect.element(getByRole('textbox', { name: 'alpha' })).not.toBeInTheDocument();
  await expect.element(getByRole('textbox', { name: 'hue' })).not.toBeInTheDocument();
  await expect.element(getByRole('textbox', { name: 'saturation' })).not.toBeInTheDocument();
  await expect.element(getByRole('textbox', { name: 'lightness' })).not.toBeInTheDocument();
});

// Test initial values reflect modelValue

test('render with modelValue', async () => {
  const { getByRole } = render(HSLSliders, {
    props: {
      modelValue: { h: 120, s: 0.5, l: 0.4, a: 0.7 },
    },
  });

  await expect.element(getByRole('textbox', { name: 'hue' })).toHaveValue('120');
  await expect.element(getByRole('textbox', { name: 'saturation' })).toHaveValue('50');
  await expect.element(getByRole('textbox', { name: 'lightness' })).toHaveValue('40');
  await expect.element(getByRole('textbox', { name: 'alpha' })).toHaveValue('0.70');
});

// Test changing inputs emits updated color

test('change color via inputs', async () => {
  const { getByRole, emitted } = render(HSLSliders, {
    props: {
      modelValue: { h: 10, s: 0.5, l: 0.5, a: 1 },
    },
  });

  const hInput = getByRole('textbox', { name: 'hue' });

  await hInput.fill('');
  expect((emitted()['update:modelValue'])).toBeUndefined();

  await hInput.fill('40');
  expect((emitted()['update:modelValue'][0] as [{ h: number }])[0].h).toBeCloseTo(40);

  const sInput = getByRole('textbox', { name: 'saturation' });
  await sInput.fill('60');
  expect((emitted()['update:modelValue'][1] as [{ s: number }])[0].s).toBeCloseTo(0.6);

  const lInput = getByRole('textbox', { name: 'lightness' });
  await lInput.fill('70');
  expect((emitted()['update:modelValue'][2] as [{ l: number }])[0].l).toBeCloseTo(0.7);

  const aInput = getByRole('textbox', { name: 'alpha' });
  await aInput.fill('0.3');
  expect((emitted()['update:modelValue'][3] as [{ a: number }])[0].a).toBeCloseTo(0.3);
});
