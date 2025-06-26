import { render } from '@testing-library/vue';
import Alpha from '@components/common/AlphaSlider.vue';
import { mockClickPosition } from '../../tool';

test('picker should reflect alpha value', () => {
  const { getByRole } = render(Alpha, {
    props: {
      value: { r: 100, g: 100, b: 100, a: 0.3 },
    },
  });
  const slider = getByRole('slider');
  const picker = slider.querySelector('div');
  expect(picker?.style.left).toBe('30%');
});

test('Click the pointer and update color events should be emitted with correct alpha value', () => {

  // jsdom doesn't do any rendering, so getBoundingClientRect() always returns 0,0,0,0
  // reference: https://github.com/jsdom/jsdom/issues/1590#issuecomment-243228840

  const { getByRole, emitted } = render(Alpha, {
    props: {
      value: { r: 100, g: 100, b: 100, a: 0.3 }
    },
  });


  const slider = getByRole('slider');
  mockClickPosition({container: slider, left: 0.5})

  expect(emitted()['input'][0][0]).toEqual({ r: 100, g: 100, b: 100, a: 0.5 });
});