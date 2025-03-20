import { expect, test } from 'vitest';
import { render } from 'vitest-browser-vue';
import MaterialPicker from '../../src/components/MaterialPicker.vue';

test('render correctly', async () => {
  const { getByLabelText } = render(MaterialPicker, {
    props: {
      modelValue: {
        r: 100,
        g: 101,
        b: 102
      }
    }
  });

  const rInput = getByLabelText('Red');
  await expect.element(rInput).toHaveValue('100');

  const gInput = getByLabelText('Green');
  await expect.element(gInput).toHaveValue('101');

  const bInput = getByLabelText('Blue');
  await expect.element(bInput).toHaveValue('102');

  const hexInput = getByLabelText('Hex');
  await expect.element(hexInput).toHaveValue('#646566');
});

test('change hex value and update color events should be emitted with correct value', async () => {
  const { getByLabelText, emitted } = render(MaterialPicker, {
    props: {
      modelValue: {
        r: 100,
        g: 101,
        b: 102
      }
    }
  });
  const hexInput = getByLabelText('Hex');

  // invalid value
  await hexInput.fill('foo');
  expect(emitted()[0]).toBeUndefined();

  await hexInput.fill('#49b3b1');
  expect((emitted()['update:modelValue'][0] as [{r: number, b: number, g: number}])[0]).toStrictEqual({r: 73, g: 179, b: 177, a: 1});
});

test('change RGB value and update color events should be emitted with correct value', async () => {
  const { getByLabelText, emitted } = render(MaterialPicker, {
    props: {
      modelValue: {
        r: 100,
        g: 101,
        b: 102
      }
    }
  });

  const rInput = getByLabelText('Red');
  await rInput.fill('200');
  expect((emitted()['update:modelValue'][0] as [{r: number, b: number, g: number}])[0]).toStrictEqual({r: 200, g: 101, b: 102, a: 1});

  const gInput = getByLabelText('Green');
  await gInput.fill('200');
  expect((emitted()['update:modelValue'][1] as [{r: number, b: number, g: number}])[0]).toStrictEqual({r: 100, g: 200, b: 102, a: 1});

  const bInput = getByLabelText('Blue');
  await bInput.fill('200');
  expect((emitted()['update:modelValue'][2] as [{r: number, b: number, g: number}])[0]).toStrictEqual({r: 100, g: 101, b: 200, a: 1});
});