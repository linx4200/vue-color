import { expect, test } from 'vitest';
import { render } from 'vitest-browser-vue';
import Hue from '../../../src/components/common/Hue.vue';

test('The position of the picker should be correct', async () => {
  const { getByRole, rerender } = render(Hue, {
    props: {
      hue: 180,
      direction: 'horizontal',
    },
  });

  const pointerElement = getByRole('presentation').element()  as HTMLElement;
  expect(pointerElement.style.left).toBe('50%');
  expect(pointerElement.style.top).toBe('0px');

  await rerender({ hue: 200 }); // pull to right
  await rerender({ hue: 0 });
  expect(pointerElement.style.left).toBe('100%');
  expect(pointerElement.style.top).toBe('0px');


  // ======= vertical =======

  await rerender({ direction: 'vertical', hue: 180 });
  expect(pointerElement.style.top).toBe('50%');
  expect(pointerElement.style.left).toBe('0px');

  await rerender({ direction: 'vertical', hue: 200 });
  await rerender({ direction: 'vertical', hue: 0 });
  expect(pointerElement.style.top).toBe('0px');
  expect(pointerElement.style.left).toBe('0px');
});

test('Click the pointer and update color events should be emitted with correct alpha value (horizontally)', async () => {
  const { getByRole, emitted } = render(Hue, {
    props: {
      hue: 10,
      direction: 'horizontal',
    },
  });

  const slider = getByRole('slider');
  const box = (slider.element() as HTMLElement).getBoundingClientRect();
  // click the middle position of the slider
  await slider.element().dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: box.left + box.width / 2, clientY: box.top + box.height / 2 }));
  expect(emitted()['change'][0]).toEqual([180, 170]);

  // click the left outer space of the slider
  await slider.element().dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: 0, clientY: box.top + box.height / 2 }));
  expect(emitted()['change'][1]).toEqual([0, -10]);

  // click the right outer space of the slider
  await slider.element().dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: box.left + box.width + 100, clientY: box.top + box.height / 2 }));
  expect(emitted()['change'][2]).toEqual([360, 350]);
});

test('Click the pointer and update color events should be emitted with correct alpha value (vertically)', async () => {
  const { getByRole, emitted } = render(Hue, {
    props: {
      hue: 10,
      direction: 'vertical',
    },
  });

  const slider = getByRole('slider');
  const box = (slider.element() as HTMLElement).getBoundingClientRect();
  // click the middle position of the slider
  await slider.element().dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: box.left + box.width / 2, clientY: box.top + box.height / 2 }));
  expect(emitted()['change'][0]).toEqual([180, 170]);

  // click the top outer space of the slider
  await slider.element().dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: box.left + box.width / 2, clientY: - 10 }));
  expect(emitted()['change'][1]).toEqual([360, 350]);

  // click the bottom outer space of the slider
  await slider.element().dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: box.left + box.width / 2, clientY: box.top + box.height + 100 }));
  expect(emitted()['change'][2]).toEqual([0, -10]);
});