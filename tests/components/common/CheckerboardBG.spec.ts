import { expect, test } from 'vitest';
import { render } from 'vitest-browser-vue';
import Checkerboard from '../../../src/components/common/CheckerboardBG.vue';

test('render correctly by default', async () => {
  const { container } = render(Checkerboard)

  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="vc-checkerboard"
        data-v-b6b137ab=""
        style="background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAOklEQVR4AeySuQ0AMAwCkbfw/rvBGM4GpHARiiBdi8RTJMcxFxWW+gZAQAfdDYckOAIiLI+YsMLzCAcAAP//0FHUVgAAAAZJREFUAwBpAlWJoGCVHAAAAABJRU5ErkJggg==");"
      />
    </div>
  `);
});

test('render correctly by with props', async () => {
  const { container } = render(Checkerboard, {
    props: { size: 100, grey: '#333', white: '#ddd' }
  })

  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="vc-checkerboard"
        data-v-b6b137ab=""
        style="background-image: url("data:image/png;base64,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");"
      />
    </div>
  `);
});
