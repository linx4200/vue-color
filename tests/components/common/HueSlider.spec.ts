import { expect, test } from 'vitest';
import { render } from 'vitest-browser-vue';
import Hue from '../../../src/components/common/HueSlider.vue';
import { waitForRerender } from '../../tools';

test('The position of the picker should be correct', async () => {
  const { getByRole, rerender } = render(Hue, {
    props: {
      hue: 180,
      direction: 'horizontal',
    },
  });

  const sliderElement = getByRole('slider').element() as HTMLElement;
  const pointerElement = sliderElement.querySelector('div');
  expect(pointerElement?.style.left).toBe('50%');
  expect(pointerElement?.style.top).toBe('0px');

  rerender({ hue: 200 }); // pull to right
  await waitForRerender();
  rerender({ hue: 0 });
  await waitForRerender();
  expect(pointerElement?.style.left).toBe('100%');
  expect(pointerElement?.style.top).toBe('0px');


  // ======= vertical =======

  rerender({ direction: 'vertical', hue: 180 });
  await waitForRerender();
  expect(pointerElement?.style.top).toBe('50%');
  expect(pointerElement?.style.left).toBe('0px');

  rerender({ direction: 'vertical', hue: 200 });
  await waitForRerender();
  rerender({ direction: 'vertical', hue: 0 });
  await waitForRerender();
  expect(pointerElement?.style.top).toBe('0px');
  expect(pointerElement?.style.left).toBe('0px');
});

test('Click the pointer and update color events should be emitted with correct alpha value (horizontally)', () => {
  const { getByRole, emitted } = render(Hue, {
    props: {
      hue: 10,
      direction: 'horizontal',
    },
  });

  const slider = getByRole('slider');
  const box = (slider.element() as HTMLElement).getBoundingClientRect();
  // click the middle position of the slider
  slider.element().dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: box.left + box.width / 2, clientY: box.top + box.height / 2 }));
  expect(emitted()['change'][0]).toEqual([180, 170]);

  // click the left outer space of the slider
  slider.element().dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: 0, clientY: box.top + box.height / 2 }));
  expect(emitted()['change'][1]).toEqual([0, -10]);

  // click the right outer space of the slider
  slider.element().dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: box.left + box.width + 100, clientY: box.top + box.height / 2 }));
  expect(emitted()['change'][2]).toEqual([360, 350]);
});

test('Click the pointer and update color events should be emitted with correct alpha value (vertically)', () => {
  const { getByRole, emitted } = render(Hue, {
    props: {
      hue: 10,
      direction: 'vertical',
    },
  });

  const slider = getByRole('slider');
  const box = (slider.element() as HTMLElement).getBoundingClientRect();
  // click the middle position of the slider
  slider.element().dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: box.left + box.width / 2, clientY: box.top + box.height / 2 }));
  expect(emitted()['change'][0]).toEqual([180, 170]);

  // click the top outer space of the slider
  slider.element().dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: box.left + box.width / 2, clientY: - 10 }));
  expect(emitted()['change'][1]).toEqual([360, 350]);

  // click the bottom outer space of the slider
  slider.element().dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: box.left + box.width / 2, clientY: box.top + box.height + 100 }));
  expect(emitted()['change'][2]).toEqual([0, -10]);
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

for (const { direction, oppositeDirection, initialValue, keyboardEventCode, changedValueNormally, valueOfLimitation} of keyboardEventCases) {
  test(`When ${keyboardEventCode} keyboard events are fired, update color events should be emitted with correct value.`, async () => {

    const { getByRole, emitted, rerender } = render(Hue, {
      props: {
        hue: initialValue,
        direction: oppositeDirection as 'horizontal' | 'vertical',
      },
    });
    const slider = getByRole('slider').element();

    // scene 1: different direction
    slider.dispatchEvent(new KeyboardEvent('keydown', { code: keyboardEventCode }));
    expect((emitted()['change'])).toBeUndefined();

    // scene 2: changes value normally
    rerender({
      direction
    })
    await waitForRerender();
    slider.dispatchEvent(new KeyboardEvent('keydown', { code: keyboardEventCode }));
    expect((emitted()['change'][0] as [number, number])[0]).toEqual(changedValueNormally);
    expect((emitted()['change'][0] as [number, number])[1]).toBeCloseTo(changedValueNormally - initialValue);


    // scene 3: exceed limitation
    rerender({
      hue: valueOfLimitation
    });
    await waitForRerender();
    slider.dispatchEvent(new KeyboardEvent('keydown', { code: keyboardEventCode }));
    expect((emitted()['change'][1] as [number, number])[0]).toEqual(valueOfLimitation);
    expect((emitted()['change'][1] as [number, number])[1]).toEqual(0);
  });
}