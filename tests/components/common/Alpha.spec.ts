import { expect, test } from 'vitest';
import { render } from 'vitest-browser-vue';
import Alpha from '../../../src/components/common/Alpha.vue';

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
