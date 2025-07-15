import { expect, test } from 'vitest';
import { render } from 'vitest-browser-vue';
import HSVSliders from '../../src/components/HSVSliders.vue';

// Test disableAlpha prop hides alpha slider and input

test('props.disableAlpha', async () => {
  const { getByRole } = render(HSVSliders, {
    props: {
      disableAlpha: true,
    },
  });
  await expect.element(getByRole('textbox', { name: 'alpha' })).not.toBeInTheDocument();
  await expect.element(getByRole('slider', { name: 'alpha' })).not.toBeInTheDocument();
});

// Test disableFields prop hides inputs

test('props.disableFields', async () => {
  const { getByRole } = render(HSVSliders, {
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
  const { getByRole } = render(HSVSliders, {
    props: {
      modelValue: { h: 120, s: 0.5, v: 0.4, a: 0.7 },
    },
  });

  await expect.element(getByRole('textbox', { name: 'hue' })).toHaveValue('120');
  await expect.element(getByRole('textbox', { name: 'saturation' })).toHaveValue('50');
  await expect.element(getByRole('textbox', { name: 'brightness' })).toHaveValue('40');
  await expect.element(getByRole('textbox', { name: 'alpha' })).toHaveValue('0.70');
});

// Test changing inputs emits updated color

test('change color via inputs', async () => {
  const { getByRole, emitted } = render(HSVSliders, {
    props: {
      modelValue: { h: 10, s: 0.5, v: 0.5, a: 1 },
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

  const lInput = getByRole('textbox', { name: 'brightness' });
  await lInput.fill('70');
  expect((emitted()['update:modelValue'][2] as [{ v: number }])[0].v).toBeCloseTo(0.7);

  const aInput = getByRole('textbox', { name: 'alpha' });
  await aInput.fill('0.3');
  expect((emitted()['update:modelValue'][3] as [{ a: number }])[0].a).toBeCloseTo(0.3);
});

test('dragging sliders updates color correctly', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  container.style.width = '250px';
  container.style.height = '10px';
  container.style.position = 'relative';

  const { getByRole, emitted } = render(HSVSliders, {
    props: {
      modelValue: { h: 10, s: 10, v: 10, a: 0 },
    },
    container
  });

  const hueSlider = getByRole('slider', { name: 'hue' });
  const hueBox = (hueSlider.element() as HTMLElement).getBoundingClientRect();
  hueSlider.element().dispatchEvent(new MouseEvent('mousedown', {
    button: 0,
    clientX: hueBox.left + hueBox.width / 2,
    clientY: hueBox.top + hueBox.height / 2
  }));
  expect((emitted()['update:modelValue'][0] as [{ h: number }])[0].h).toBeCloseTo(180, -1);

  const sSlider = getByRole('slider', { name: 'saturation' });
  const sBox = (sSlider.element() as HTMLElement).getBoundingClientRect();
  sSlider.element().dispatchEvent(new MouseEvent('mousedown', {
    button: 0,
    clientX: sBox.left + sBox.width / 2,
    clientY: sBox.top + sBox.height / 2
  }));
  expect((emitted()['update:modelValue'][1] as [{ s: number }])[0].s).toBeCloseTo(0.5);

  const lSlider = getByRole('slider', { name: 'brightness' });
  const lBox = (lSlider.element() as HTMLElement).getBoundingClientRect();
  lSlider.element().dispatchEvent(new MouseEvent('mousedown', {
    button: 0,
    clientX: lBox.left + lBox.width / 2,
    clientY: lBox.top + lBox.height / 2
  }));
  expect((emitted()['update:modelValue'][2] as [{ v: number }])[0].v).toBeCloseTo(0.5);

  const aSlider = getByRole('slider', { name: 'Transparency' });
  const aBox = (aSlider.element() as HTMLElement).getBoundingClientRect();
  aSlider.element().dispatchEvent(new MouseEvent('mousedown', {
    button: 0,
    clientX: aBox.left + aBox.width / 2,
    clientY: aBox.top + aBox.height / 2
  }));
  expect((emitted()['update:modelValue'][3] as [{ a: number }])[0].a).toBeCloseTo(0.5);
});