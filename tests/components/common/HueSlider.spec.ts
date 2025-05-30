import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import Hue from '../../../src/components/common/HueSlider.vue';
import { waitForRerender } from '../../tools';

test('The position of the picker should be correct', async () => {
  const { getByRole, rerender } = render(Hue, {
    props: {
      modelValue: 180,
      direction: 'horizontal',
    },
  });

  const sliderElement = getByRole('slider').element() as HTMLElement;
  const pointerElement = sliderElement.querySelector('div');
  expect(pointerElement?.style.left).toBe('50%');
  expect(pointerElement?.style.top).toBe('0px');

  rerender({ modelValue: 200 }); // pull to right
  await waitForRerender();
  rerender({ modelValue: 0 });
  await waitForRerender();
  expect(pointerElement?.style.left).toBe('100%');
  expect(pointerElement?.style.top).toBe('0px');

  // test invalid input format
  rerender({ modelValue: 'abc' });
  await waitForRerender();
  expect(pointerElement?.style.left).toBe('100%');


  // ======= vertical =======

  rerender({ direction: 'vertical', modelValue: 180 });
  await waitForRerender();
  expect(pointerElement?.style.top).toBe('50%');
  expect(pointerElement?.style.left).toBe('0px');

  rerender({ direction: 'vertical', modelValue: 200 });
  await waitForRerender();
  rerender({ direction: 'vertical', modelValue: 0 });
  await waitForRerender();
  expect(pointerElement?.style.top).toBe('0px');
  expect(pointerElement?.style.left).toBe('0px');
});

test('Click the pointer and update color events should be emitted with correct alpha value (horizontally)', () => {
  const { getByRole, emitted } = render(Hue, {
    props: {
      modelValue: 10,
      direction: 'horizontal',
    },
  });

  const slider = getByRole('slider');
  const box = (slider.element() as HTMLElement).getBoundingClientRect();
  // click the middle position of the slider
  slider.element().dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: box.left + box.width / 2, clientY: box.top + box.height / 2 }));
  expect(emitted()['update:modelValue'][0]).toEqual([180]);

  // click the left outer space of the slider
  slider.element().dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: -10, clientY: box.top + box.height / 2 }));
  expect(emitted()['update:modelValue'][1]).toEqual([0]);

  // click the right outer space of the slider
  slider.element().dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: box.left + box.width + 100, clientY: box.top + box.height / 2 }));
  expect(emitted()['update:modelValue'][2]).toEqual([360]);
});

test('Click the pointer and update color events should be emitted with correct alpha value (vertically)', () => {
  const { getByRole, emitted } = render(Hue, {
    props: {
      modelValue: 10,
      direction: 'vertical',
    },
  });

  const slider = getByRole('slider');
  const box = (slider.element() as HTMLElement).getBoundingClientRect();
  // click the middle position of the slider
  slider.element().dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: box.left + box.width / 2, clientY: box.top + box.height / 2 }));
  expect(emitted()['update:modelValue'][0]).toEqual([180]);

  // click the top outer space of the slider
  slider.element().dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: box.left + box.width / 2, clientY: - 10 }));
  expect(emitted()['update:modelValue'][1]).toEqual([360]);

  // click the bottom outer space of the slider
  slider.element().dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: box.left + box.width / 2, clientY: box.top + box.height + 100 }));
  expect(emitted()['update:modelValue'][2]).toEqual([0]);
});

test('When touch or mouse events are finished, should remove all event listeners', () => {
  const { getByRole } = render(Hue, {
    props: {
      modelValue: 10,
      direction: 'vertical',
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

const keyboardEventCases = [
  {
    keyboardEventCode: 'ArrowUp',
    direction: 'vertical' as const,
    oppositeDirection: 'horizontal' as const,
    initialValue: 11.1,
    changedValueNormally: 13,
    valueOfLimitation: 360
  },
  {
    keyboardEventCode: 'ArrowDown',
    direction: 'vertical' as const,
    oppositeDirection: 'horizontal' as const,
    initialValue: 11.1,
    changedValueNormally: 10,
    valueOfLimitation: 0
  },
  {
    keyboardEventCode: 'ArrowLeft',
    direction: 'horizontal' as const,
    oppositeDirection: 'vertical' as const,
    initialValue: 15.1,
    changedValueNormally: 14,
    valueOfLimitation: 0
  },
  {
    keyboardEventCode: 'ArrowRight',
    direction: 'horizontal' as const,
    oppositeDirection: 'vertical' as const,
    initialValue: 50.6,
    changedValueNormally: 52,
    valueOfLimitation: 360
  }
];

describe('When keyboard events is fired, update color events should be emitted with correct value', () => {
  test.each(keyboardEventCases)('$keyboardEventCode', async ({ direction, oppositeDirection, initialValue, keyboardEventCode, changedValueNormally, valueOfLimitation}) => {
    const { getByRole, emitted, rerender } = render(Hue, {
      props: {
        modelValue: initialValue,
        direction: oppositeDirection as 'horizontal' | 'vertical',
      },
    });
    const slider = getByRole('slider').element();

    // scene 1: different direction
    slider.dispatchEvent(new KeyboardEvent('keydown', { code: keyboardEventCode }));
    expect((emitted()['update:modelValue'])).toBeUndefined();

    // scene 2: changes value normally
    rerender({
      direction
    })
    await waitForRerender();
    slider.dispatchEvent(new KeyboardEvent('keydown', { code: keyboardEventCode }));
    expect((emitted()['update:modelValue'][0] as [number])[0]).toEqual(changedValueNormally);


    // scene 3: exceed limitation
    rerender({
      modelValue: valueOfLimitation
    });
    await waitForRerender();
    slider.dispatchEvent(new KeyboardEvent('keydown', { code: keyboardEventCode }));
    expect((emitted()['update:modelValue'][1] as [number])[0]).toEqual(valueOfLimitation);
  });
})