import { render } from '@testing-library/vue';
import Saturation from '@components/common/SaturationSlider.vue';
import { mockClickPosition } from '../../tool';

test('The position of the picker should be correct', () => {

  const { getByRole } = render(Saturation, {
    props: {
      value: {
        h: 38,
        s: 0.35,
        l: 0.4
      }
    },
  });
  const slider = getByRole('slider');
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
  const { getByRole, emitted } = render(Saturation, { props: {
    value: {
      h: 100,
      s: 0.1,
      v: 0.1,
      a: 1
    }
  }});

  const container = getByRole('application');

  mockClickPosition({ container });
  mockClickPosition({ container, top: 0.25, left: 0.25, event: 'mouseMove'});

  expect(emitted()['input'][0]).toEqual([{h: 100, a: 1, s: 0.25, v: 0.75}]);
});