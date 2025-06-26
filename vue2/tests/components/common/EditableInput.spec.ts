import { render, fireEvent } from '@testing-library/vue';
import EditableInput from '@components/common/EditableInput.vue';

test('Change the value and emit the event', () => {
  const { getByRole, emitted } = render(EditableInput, {
    props: {
      value: 'value',
      label: 'label',
    },
  });

  const textbox = getByRole('textbox');
  fireEvent.update(textbox, 'changed value');

  expect((textbox as HTMLInputElement).value).toBe('changed value');
  expect(emitted()['change'][0]).toEqual(['changed value']);
});