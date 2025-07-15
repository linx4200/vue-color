import { expect, test } from 'vitest';
import { render } from 'vitest-browser-vue';
import RGBSliders from '../../src/components/RGBSliders.vue';

// Test disableAlpha prop hides alpha slider and input

test('props.disableAlpha', async () => {
  const { getByRole } = render(RGBSliders, {
    props: {
      disableAlpha: true,
    },
  });
  await expect.element(getByRole('textbox', { name: 'alpha' })).not.toBeInTheDocument();
  await expect.element(getByRole('slider', { name: 'alpha' })).not.toBeInTheDocument();
});

// Test disableFields prop hides inputs

test('props.disableFields', async () => {
  const { getByRole } = render(RGBSliders, {
    props: {
      disableFields: true,
    },
  });
  await expect.element(getByRole('textbox', { name: 'alpha' })).not.toBeInTheDocument();
  await expect.element(getByRole('textbox', { name: 'red' })).not.toBeInTheDocument();
  await expect.element(getByRole('textbox', { name: 'green' })).not.toBeInTheDocument();
  await expect.element(getByRole('textbox', { name: 'blue' })).not.toBeInTheDocument();
});

// Test initial values reflect modelValue

test('render with modelValue', async () => {
  const { getByRole } = render(RGBSliders, {
    props: {
      modelValue: { r: 120, g: 5, b: 48, a: 0.7 },
    },
  });

  await expect.element(getByRole('textbox', { name: 'red' })).toHaveValue('120');
  await expect.element(getByRole('textbox', { name: 'green' })).toHaveValue('5');
  await expect.element(getByRole('textbox', { name: 'blue' })).toHaveValue('48');
  await expect.element(getByRole('textbox', { name: 'alpha' })).toHaveValue('0.70');
});

// Test changing inputs emits updated color

test('change color via inputs', async () => {
  const { getByRole, emitted } = render(RGBSliders, {
    props: {
      modelValue: { r: 120, g: 5, b: 48, a: 0.7 },
    },
  });

  const redInput = getByRole('textbox', { name: 'red' });
  await redInput.fill('40');
  expect((emitted()['update:modelValue'][0] as [{ r: number }])[0].r).toBeCloseTo(40);

  const greenInput = getByRole('textbox', { name: 'green' });
  await greenInput.fill('60');
  expect((emitted()['update:modelValue'][1] as [{ g: number }])[0].g).toBeCloseTo(60);

  const blueInput = getByRole('textbox', { name: 'blue' });
  await blueInput.fill('222');
  expect((emitted()['update:modelValue'][2] as [{ b: number }])[0].b).toBeCloseTo(222);

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

  const { getByRole, emitted } = render(RGBSliders, {
    props: {
      modelValue: { r: 120, g: 5, b: 48, a: 0.7 },
    },
    container
  });

  const hueSlider = getByRole('slider', { name: 'red' });
  const hueBox = (hueSlider.element() as HTMLElement).getBoundingClientRect();
  hueSlider.element().dispatchEvent(new MouseEvent('mousedown', {
    button: 0,
    clientX: hueBox.left + hueBox.width / 2,
    clientY: hueBox.top + hueBox.height / 2
  }));
  expect((emitted()['update:modelValue'][0] as [{ r: number }])[0].r).toBeCloseTo(126, 0);

  const greenSlider = getByRole('slider', { name: 'green' });
  const gBox = (greenSlider.element() as HTMLElement).getBoundingClientRect();
  greenSlider.element().dispatchEvent(new MouseEvent('mousedown', {
    button: 0,
    clientX: gBox.left + gBox.width / 2,
    clientY: gBox.top + gBox.height / 2
  }));
  expect((emitted()['update:modelValue'][1] as [{ g: number }])[0].g).toBeCloseTo(126, 0);

  const bSlider = getByRole('slider', { name: 'blue' });
  const bBox = (bSlider.element() as HTMLElement).getBoundingClientRect();
  bSlider.element().dispatchEvent(new MouseEvent('mousedown', {
    button: 0,
    clientX: bBox.left + bBox.width / 2,
    clientY: bBox.top + bBox.height / 2
  }));
  expect((emitted()['update:modelValue'][2] as [{ b: number }])[0].b).toBeCloseTo(126, 0);

  const aSlider = getByRole('slider', { name: 'Transparency' });
  const aBox = (aSlider.element() as HTMLElement).getBoundingClientRect();
  aSlider.element().dispatchEvent(new MouseEvent('mousedown', {
    button: 0,
    clientX: aBox.left + aBox.width / 2,
    clientY: aBox.top + aBox.height / 2
  }));
  expect((emitted()['update:modelValue'][3] as [{ a: number }])[0].a).toBeCloseTo(0.5);
});