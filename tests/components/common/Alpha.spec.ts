import { expect, test } from 'vitest';
import { render } from 'vitest-browser-vue';
import Alpha from '../../../src/components/common/AlphaSlider.vue';

test('The position of the picker should be correct when rendered with a color with alpha value.', async () => {
  const { getByRole } = render(Alpha, {
    props: {
      modelValue: { r: 100, g: 100, b: 100, a: 0.3 }
    },
  });
  const picker = getByRole('slider', { name: "current alpha value is 0.3" });
  const left = (picker.element() as HTMLElement).style.left;
  expect(left).toBe('30%');
});

test('Click the pointer and update color events should be emitted with correct alpha value', async () => {

  const container = document.createElement('div');
  document.body.appendChild(container);
  container.style.width = '100px';
  container.style.height = '10px';

  const { getByTestId, emitted } = render(Alpha, {
    props: {
      modelValue: { r: 100, g: 100, b: 100, a: 0.3 }
    },
    container
  });
  const slider = getByTestId('slider-container');
  const box = (slider.element() as HTMLElement).getBoundingClientRect();

  // click the middle of the slider
  const mouseEvent1 = new MouseEvent('mousedown', { button: 0, clientX: box.left + box.width / 2, clientY: box.top + 5 });
  slider.element().dispatchEvent(mouseEvent1);

  expect(emitted()).toHaveProperty('update:modelValue');
  expect(emitted()['update:modelValue'][0]).toEqual([{ r: 100, g: 100, b: 100, a: 0.5 }]);

  // click the left outer space of the slider
  const mouseEvent2 = new MouseEvent('mousedown', { button: 0, clientX: 0, clientY: box.top + 5 });
  slider.element().dispatchEvent(mouseEvent2);

  expect(emitted()).toHaveProperty('update:modelValue');
    expect(emitted()['update:modelValue'][1]).toEqual([{ r: 100, g: 100, b: 100, a: 0 }]);

  // click the right outer space of the slider
  const mouseEvent3 = new MouseEvent('mousedown', { button: 0, clientX: box.left + box.width + 10, clientY: box.top + 5 });
  slider.element().dispatchEvent(mouseEvent3);

  expect(emitted()).toHaveProperty('update:modelValue');
  expect(emitted()['update:modelValue'][2]).toEqual([{ r: 100, g: 100, b: 100, a: 1 }]);
});
