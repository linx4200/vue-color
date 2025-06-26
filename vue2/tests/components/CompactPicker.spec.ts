import { render } from '@testing-library/vue';
import CompactPicker from '@components/CompactPicker.vue';
import { wait } from '../tool';

test('click one of the color in the palette', async () => {
  const { getAllByRole, emitted } = render(CompactPicker, {
    props: {
      value: '#a83292'
    }
  });
  const options = getAllByRole('option');
  options[3].click();

  // wait for click event to take effect
  await wait();

  expect((emitted()['input'][0] as [string])[0]).toBe('#F44E3B'.toLowerCase());
});

test('he output value should follow the same format as the input value', async () => {
  const { getAllByRole, emitted } = render(CompactPicker, {
    props: {
      value: { r: '50%', g: '50%', b: '50%' }
    }
  });
  const options = getAllByRole('option');

  options[8].click();
  // wait for click event to take effect
  await wait();

  const toBeChecked = (emitted()['input'][0] as [{ r: string, g: string, b: string}])[0];
  expect(Number(toBeChecked.r.replace('%', ''))).toBeCloseTo(41);
  expect(Number(toBeChecked.g.replace('%', ''))).toBeCloseTo(80);
  expect(Number(toBeChecked.b.replace('%', ''))).toBeCloseTo(79);
});