import { expect, test } from 'vitest';
import { render } from 'vitest-browser-vue';
import Saturation from '../../../src/components/common/SaturationSlider.vue';
import { waitForRerender } from '../../tools';

test('Render background with given hue value', async () => {
  const { getByRole, rerender } = render(Saturation, {
    props: {
      hue: 180,
    },
  });

  const background = getByRole('application').element() as HTMLElement;
  // hsl(180, 100%, 50%)
  expect(background.style.backgroundColor).toEqual('rgb(0, 255, 255)');

  // @ts-expect-error ts type issue, not a big deal
  rerender({ tinyColor: { h: 282, s: 1, l: 0.5 }, hue: undefined});
  await waitForRerender();
  expect(background.style.background).toBe('rgb(178, 0, 255)');
});

test('The position of the picker should be correct', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  container.style.width = '100px';
  container.style.height = '100px';
  container.style.position = 'relative';

  const { getByRole } = render(Saturation, {
    props: {
      modelValue: {
        h: 38,
        s: 0.35,
        l: 0.4
      }
    },
    container
  });
  const slider = getByRole('slider').element();
  const styleString = slider.getAttribute('style');
  const styleJSON = styleString?.split(';').map(s => s.trim()).reduce((result, style) => {
    const [k, v] = style.split(':');
    if (k) {
      result[k] = Number(v.trim().replace('%', ''));
    }
    return result;
  }, {} as Record<string, number>);
  expect(styleJSON?.left).toBeCloseTo(50, -1);
  expect(styleJSON?.top).toBeCloseTo(50, -1);
});

test('Click the pointer and update color events should be emitted with correct value', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  container.style.width = '100px';
  container.style.height = '100px';
  container.style.position = 'relative';

  const { getByRole, emitted } = render(Saturation, { props: {
    modelValue: {
      h: 100,
      s: 0.1,
      v: 0.1,
      a: 1
    }
  }, container });

  const containerELE = getByRole('application').element();
  const box = containerELE.getBoundingClientRect();

  containerELE.dispatchEvent(new MouseEvent('touchstart', { button: 0, clientX: box.left + box.width / 4, clientY: box.top + box.height / 4 }));
  expect(emitted()['update:modelValue'][0]).toEqual([{h: 100, a: 1, s: 0.25, v: 0.75}]);

  // out of container
  containerELE.dispatchEvent(new MouseEvent('touchstart', { button: 0, clientX: box.width + 10, clientY: box.height + 10 }));
  // todo: hue is lost again
  expect(emitted()['update:modelValue'][1]).toEqual([{h: 0, a: 1, s: 0, v: 0}]);

  containerELE.dispatchEvent(new MouseEvent('touchstart', { button: 0, clientX: -10, clientY: -10 }));
  // todo: hue is lost again
  expect(emitted()['update:modelValue'][2]).toEqual([{h: 0, a: 1, s: 0, v: 1}]);
});


const initialValueOfKeyboardEventCases = { h: 100, s: 0.1, v: 0.1, a: 1 };
const keyboardEventCases = [
  {
    keyboardEventCode: 'ArrowUp',
    expectedValue: {
      ...initialValueOfKeyboardEventCases,
      v: initialValueOfKeyboardEventCases.v + 0.01
    }
  },
  {
    keyboardEventCode: 'ArrowDown',
    expectedValue: {
      ...initialValueOfKeyboardEventCases,
      v: initialValueOfKeyboardEventCases.v - 0.01
    }
  },
  {
    keyboardEventCode: 'ArrowLeft',
    expectedValue: {
      ...initialValueOfKeyboardEventCases,
      s: initialValueOfKeyboardEventCases.s - 0.01
    }
  },
  {
    keyboardEventCode: 'ArrowRight',
    expectedValue: {
      ...initialValueOfKeyboardEventCases,
      s: initialValueOfKeyboardEventCases.s + 0.01
    }
  }
];

for (const { keyboardEventCode, expectedValue} of keyboardEventCases) {
  test(`When ${keyboardEventCode} keyboard events are fired, update color events should be emitted with correct value.`, async () => {

    const container = document.createElement('div');
    document.body.appendChild(container);
    container.style.width = '100px';
    container.style.height = '100px';
    container.style.position = 'relative';

    const { getByRole, emitted } = render(Saturation, { props: {
      modelValue: initialValueOfKeyboardEventCases
    }, container });

    getByRole('slider').element().dispatchEvent(new KeyboardEvent('keydown', { code: keyboardEventCode }));
    const returnedValue = (emitted()['update:modelValue'][0] as [typeof expectedValue])[0];
    (Object.keys(returnedValue) as [keyof typeof initialValueOfKeyboardEventCases]).forEach((k) => {
      expect(returnedValue[k]).toBeCloseTo(expectedValue[k]);
    })
  });
}