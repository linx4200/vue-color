import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import Alpha from '../../../src/components/common/AlphaSlider.vue';

test('The position of the picker should be correct when rendered with a color with alpha value.', async () => {
  const { getByRole } = render(Alpha, {
    props: {
      modelValue: { r: 100, g: 100, b: 100, a: 0.3 }
    },
  });
  const slider = getByRole('slider');
  const picker = slider.element().querySelector('div');
  const left = picker?.style.left;
  expect(left).toBe('30%');
});

test('Click the pointer and update color events should be emitted with correct alpha value', async () => {

  const container = document.createElement('div');
  document.body.appendChild(container);
  container.style.width = '100px';
  container.style.height = '10px';

  const { getByRole, emitted } = render(Alpha, {
    props: {
      modelValue: { r: 100, g: 100, b: 100, a: 0.3 }
    },
    container
  });
  const slider = getByRole('slider');
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

test('When touch or mouse events are finished, should remove all event listeners', () => {
  const { getByRole } = render(Alpha, {
    props: {
      modelValue: { r: 100, g: 100, b: 100, a: 0.3 }
    },
  });

  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

  const containerELE = getByRole('slider').element();
  containerELE.dispatchEvent(new MouseEvent('touchstart'));
  expect(removeEventListenerSpy).toHaveBeenCalledTimes(0);

  window.dispatchEvent(new MouseEvent('touchend'));
  expect(removeEventListenerSpy).toHaveBeenCalledTimes(4);

  containerELE.dispatchEvent(new MouseEvent('mousedown'));
  window.dispatchEvent(new MouseEvent('mouseup'));
  expect(removeEventListenerSpy).toHaveBeenCalledTimes(8);
});

test('When up and down keyboard events are fired then update color events should be emitted with correct alpha value', async () => {

  const { getByRole, emitted, rerender } = render(Alpha, {
    props: {
      modelValue: { r: 100, g: 100, b: 100, a: 0.2 }
    }
  });

  const slider = getByRole('slider').element();
  const keyboardEvent1 = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
  slider.dispatchEvent(keyboardEvent1);

  expect(emitted()).toHaveProperty('update:modelValue');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  expect(emitted()['update:modelValue'][0]?.[0]?.a).toBeCloseTo(0.19, 0);

  await rerender({modelValue : { r: 100, g: 100, b: 100, a: 0 }});
  const keyboardEvent2 = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
  slider.dispatchEvent(keyboardEvent2);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  expect(emitted()['update:modelValue'][1]?.[0]?.a).toBe(0);


  const keyboardEvent3 = new KeyboardEvent('keydown', { code: 'ArrowRight' });
  slider.dispatchEvent(keyboardEvent3);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  expect(emitted()['update:modelValue'][2]?.[0]?.a).toBe(0.01);

  await rerender({modelValue : { r: 100, g: 100, b: 100, a: 1 }});
  const keyboardEvent4 = new KeyboardEvent('keydown', { code: 'ArrowRight' });
  slider.dispatchEvent(keyboardEvent4);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  expect(emitted()['update:modelValue'][3]?.[0]?.a).toBe(1);
});
