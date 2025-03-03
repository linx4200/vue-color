import { expect, test } from 'vitest';
import { render } from 'vitest-browser-vue';
import Saturation from '../../../src/components/common/SaturationSlider.vue';

test('Render background with given hue value', async () => {
  const { getByRole, rerender } = render(Saturation, {
    props: {
      hue: 180,
    },
  });

  const background = getByRole('slider').element() as HTMLElement;
  // hsl(180, 100%, 50%)
  expect(background.style.backgroundColor).toEqual('rgb(0, 255, 255)');

  // @ts-expect-error ts type issue, not a big deal
  await rerender({ tinyColor: { h: 282, s: 1, l: 0.5 }, hue: undefined});
  expect(background.style.background).toBe('rgb(178, 0, 255)');
});

test('The position of the picker should be correct', async () => {
  // const { getByRole, rerender } = render(Saturation, {
  //   props: {
  //     modelValue: {
  //       h: 38,
  //       s: 0.35,
  //       l: 0.5
  //     }
  //   },
  // });
});