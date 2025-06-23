import { expect, test, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import CompactPicker from '../../src/components/CompactPicker.vue';
import { tinycolor } from '../../src/index';

test('render with different palette', async () => {
  const { getByRole } = render(CompactPicker, {
    props: {
      palette: ['#a83292', '#a8ff92', '#263d1e'],
      tinyColor: '#a83292'
    }
  });
  const paletteListElE = getByRole('listbox').element();
  expect(paletteListElE.childElementCount).toBe(3);

  await expect.element(getByRole('option').nth(0)).toHaveAttribute('aria-selected', "true");
  await expect.element(getByRole('option').nth(1)).toHaveAttribute('aria-selected', "false");
  await expect.element(getByRole('option').nth(2)).toHaveAttribute('aria-selected', "false");
});

test('click one of the color in the palette', async () => {
  const { getByRole, emitted, rerender } = render(CompactPicker, {
    props: {
      modelValue: '#a83292'
    } as { modelValue?: string, tinyColor?: tinycolor.ColorInput }
  });
  const options = getByRole('option');
  await options.nth(3).click();

  expect((emitted()['update:modelValue'][0] as [string])[0]).toBe('#F44E3B'.toLowerCase());

  // press Space bar
  options.nth(4).element().dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
  expect((emitted()['update:modelValue'][1] as [string])[0]).toBe('#FE9200'.toLowerCase());

  rerender({
    tinyColor: tinycolor('#333')
  });
  await options.nth(7).click();
  expect((emitted()['update:tinyColor'][0] as [tinycolor.Instance])[0].toHexString().toUpperCase()).toBe('#A4DD00');
});

describe('The output value should follow the same format as the input value', async () => {
  const cases = [
    {
      format: 'hex8',
      input: '#ffffff00',
      expectFunc: (toBeChecked: string) => {
        expect(toBeChecked).toBe('#68cccaff');
      }
    },
    {
      format: 'hex',
      input: '#ffffff',
      expectFunc: (toBeChecked: string) => {
        expect(toBeChecked).toBe('#68ccca');
      }
    },
    {
      format: 'prgb',
      input: { r: '50%', g: '50%', b: '50%' },
      expectFunc: (toBeChecked: { r: string, g: string, b: string}) => {
        expect(Number(toBeChecked.r.replace('%', ''))).toBeCloseTo(41);
        expect(Number(toBeChecked.g.replace('%', ''))).toBeCloseTo(80);
        expect(Number(toBeChecked.b.replace('%', ''))).toBeCloseTo(79);
      },
    },
    {
      format: 'prgb(string)',
      input: 'rgb(1%, 1%, 1%)',
      expectFunc: (toBeChecked: string) => {
        expect(toBeChecked).toBe('rgb(41%, 80%, 79%)');
      }
    },
    {
      format: 'rgb',
      input: { r: 10, g: 10, b: 10 },
      expectFunc: (toBeChecked: { r: number, g: number, b: number}) => {
        expect(toBeChecked.r).toBeCloseTo(104);
        expect(toBeChecked.g).toBeCloseTo(204);
        expect(toBeChecked.b).toBeCloseTo(202);
      },
    },
    {
      format: 'rgb(string)',
      input: 'rgb(1, 1, 1)',
      expectFunc: (toBeChecked: string) => {
        expect(toBeChecked).toBe('rgb(104, 204, 202)');
      },
    },
    {
      format: 'hsv',
      input: { h: 0, s: 0, v: 0 },
      expectFunc: (toBeChecked: { h: number, s: number, v: number}) => {
        expect(toBeChecked.h).toBeCloseTo(179, 0);
        expect(toBeChecked.s).toBeCloseTo(0.49);
        expect(toBeChecked.v).toBeCloseTo(0.8);
      },
    },
    {
      format: 'hsl',
      input: { h: 0, s: 0, l: 0 },
      expectFunc: (toBeChecked: { h: number, s: number, l: number}) => {
        expect(toBeChecked.h).toBeCloseTo(179, 0);
        expect(toBeChecked.s).toBeCloseTo(0.5);
        expect(toBeChecked.l).toBeCloseTo(0.6);
      },
    },
    {
      format: 'hsv(string)',
      input: 'hsva(1, 1%, 1%, 1)',
      expectFunc: (toBeChecked: string) => {
        expect(toBeChecked).toBe('hsv(179, 49%, 80%)');
      },
    },
    {
      format: 'hsl(string)',
      input: 'hsl(1, 1%, 1%)',
      expectFunc: (toBeChecked: string) => {
        expect(toBeChecked).toBe('hsl(179, 50%, 60%)');
      },
    },
  ];
  test.each(cases)('$format', async ({ input, expectFunc }) => {
    const { getByRole, emitted } = render(CompactPicker, {
      props: {
        modelValue: input
      }
    });
    const presetColors = getByRole('option');
    await presetColors.nth(8).click();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectFunc((emitted()['update:modelValue'][0] as [string])[0] as any);
  })
});