
import { render, fireEvent } from '@testing-library/vue';
import MaterialPicker from '@components/MaterialPicker.vue';

test('change hex value and update color events should be emitted with correct value', async () => {
  const { getByLabelText, emitted } = render(MaterialPicker, {
    props: {
      value: {
        r: 100,
        g: 101,
        b: 102
      }
    }
  });
  const hexInput = getByLabelText('Hex');

  fireEvent.update(hexInput, '#49b3b1');
  expect((emitted()['input'][0] as [{r: number, b: number, g: number}])[0]).toStrictEqual({r: 73, g: 179, b: 177, a: 1});
});