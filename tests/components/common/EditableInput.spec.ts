import { expect, test } from 'vitest';
import { render } from 'vitest-browser-vue';
import EditableInput from '../../../src/components/common/EditableInput.vue';

test('Render correctly with value, label and desc', async () => {
  const { getByText, getByRole } = render(EditableInput, {
    props: {
      value: 'value',
      label: 'label',
      desc: 'desc',
    },
  });

  expect(getByText('label')).not.toBeNull();
  expect(getByText('desc')).not.toBeNull();
  await expect.element(getByRole('textbox')).toHaveValue('value');
});

test('render correct aria-label with props.label', async () => {
  const { getByRole } = render(EditableInput, {
    props: {
      value: 'value',
      label: 'foo'
    },
  });
  const textbox = getByRole('textbox');
  await expect.element(textbox).toHaveAccessibleName('foo');
  await expect.element(textbox).toHaveAttribute('id', expect.stringContaining('input__label__foo__'));
});

test('render correct aria-label with props.a11y.label', async () => {
  const { getByRole } = render(EditableInput, {
    props: {
      value: 'value',
      label: 'foo',
      a11y: {
        label: 'bar'
      }
    },
  });
  const textbox = getByRole('textbox');
  await expect.element(textbox).toHaveAccessibleName('bar');
  await expect.element(textbox).toHaveAttribute('id', expect.stringContaining('input__label__bar__'));
});

test('Change the value and emit the event', async () => {
  const { getByRole, emitted } = render(EditableInput, {
    props: {
      value: 'value',
      label: 'label',
    },
  });
  const textbox = getByRole('textbox');
  await textbox.fill('changed value');
  await expect.element(textbox).toHaveValue('changed value');
  expect(emitted()['change'][0]).toEqual(['changed value']);
});

test('Input value should be within max and min range', async () => {
  const max = 10;
  const min = -10;
  const { getByRole, emitted } = render(EditableInput, {
    props: {
      value: 1,
      label: 'label',
      max,
      min,
    },
  });
  const textbox = getByRole('textbox');
  await textbox.fill(`${max + 1}`);
  expect(emitted()['change'][0]).toEqual([max]);
  await textbox.fill(`${min - 1}`);
  expect(emitted()['change'][1]).toEqual([min]);
});

test('Handle the key down event with step', async () => {
  const step = 2;
  const initialValue = 1;
  const { getByRole, emitted, rerender } = render(EditableInput, {
    props: {
      value: initialValue,
      label: 'label',
      step,
    },
  });
  const textbox = getByRole('textbox');

  textbox.element().dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp' }));
  expect(emitted()['change'][0]).toEqual([`${initialValue + step}`]);

  textbox.element().dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown' }));
  expect(emitted()['change'][1]).toEqual([`${initialValue - step}`]);

  rerender({ step: 2.2, value: 1.111 });
  await Promise.resolve();
  textbox.element().dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp' }));
  expect(emitted()['change'][2]).toEqual(['3.3']);
});