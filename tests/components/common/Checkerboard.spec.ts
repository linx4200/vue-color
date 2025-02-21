import { expect, test } from 'vitest';
import { render } from 'vitest-browser-vue';
import Checkerboard from '../../../src/components/common/Checkerboard.vue';

test('render correctly by default', async () => {
  const { container } = render(Checkerboard)

  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="_checkerboard_zoio7_2 vc-checkerboard"
        style="background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAADBJREFUOE9jfPbs2X8GPEBSUhKfNAPjqAHDIgz+//+PNx08f/4cfzoYNYCBceiHAQC5flV5JzgrxQAAAABJRU5ErkJggg==");"
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
        class="_checkerboard_zoio7_2 vc-checkerboard"
        style="background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAABXZJREFUeF7t1QERgCAUBUHIRBdC0oksWmNnOBN8XW/eXGt9o4f5Aucc5pYOGWMWiPUbFIjlUSCWxygQC6RALI8CwTwKBANpQSyQArE8WhDMo0AwkBbEAikQy6MFwTwKBANpQSyQArE8WhDMo0AwkBbEAikQy6MFwTwKBANpQSyQArE8WhDMo0AwkBbEAikQy6MFwTwKBANpQSyQArE8WhDMo0AwkBbEAikQy6MFwTwKBANpQSyQArE8WhDMo0AwkBbEAikQy6MFwTwKBANpQSyQArE8WhDMo0AwkBbEAikQy6MFwTwKBANpQSyQArE8WhDMo0AwkBbEAikQy6MFwTwKBANpQSyQArE8WhDMo0AwkBbEAikQy6MFwTwKBANpQSyQArE8WhDMo0AwkBbEAikQy6MFwTwKBANpQSyQArE8WhDMo0AwkBbEAikQy6MFwTwKBANpQSyQArE8WhDMo0AwkBbEAikQy6MFwTwKBANpQSyQArE8WhDMo0AwkBbEAikQy6MFwTwKBANpQSyQArE8WhDMo0AwkBbEAikQy6MFwTwKBANpQSyQArE8WhDMo0AwkBbEAikQy6MFwTwKBANpQSyQArE8WhDMo0AwkBbEAikQy6MFwTwKBANpQSyQArE8WhDMo0AwkBbEAikQy6MFwTwKBANpQSyQArE8WhDMo0AwkBbEAikQy6MFwTwKBANpQSyQArE8WhDMo0AwkBbEAikQy6MFwTwKBANpQSyQArE8WhDMo0AwkBbEAikQy6MFwTwKBANpQSyQArE8WhDMo0AwkBbEAikQy6MFwTwKBANpQSyQArE8WhDMo0AwkBbEAikQy6MFwTwKBANpQSyQArE8WhDMo0AwkBbEAikQy6MFwTwKBANpQSyQArE8WhDMo0AwkBbEAikQy6MFwTwKBANpQSyQArE8WhDMo0AwkBbEAikQy6MFwTzmvffDbnr6nL330++vvXyBYCIFYoEUiOUxCsQCKRDLo0AwjwLBQFoQC6RALI8WBPMoEAykBbFACsTyaEEwjwLBQFoQC6RALI8WBPMoEAykBbFACsTyaEEwjwLBQFoQC6RALI8WBPMoEAykBbFACsTyaEEwjwLBQFoQC6RALI8WBPMoEAykBbFACsTyaEEwjwLBQFoQC6RALI8WBPMoEAykBbFACsTyaEEwjwLBQFoQC6RALI8WBPMoEAykBbFACsTyaEEwjwLBQFoQC6RALI8WBPMoEAykBbFACsTyaEEwjwLBQFoQC6RALI8WBPMoEAykBbFACsTyaEEwjwLBQFoQC6RALI8WBPMoEAykBbFACsTyaEEwjwLBQFoQC6RALI8WBPMoEAykBbFACsTyaEEwjwLBQFoQC6RALI8WBPMoEAykBbFACsTyaEEwjwLBQFoQC6RALI8WBPMoEAykBbFACsTyaEEwjwLBQFoQC6RALI8WBPMoEAykBbFACsTyaEEwjwLBQFoQC6RALI8WBPMoEAykBbFACsTyaEEwjwLBQFoQC6RALI8WBPMoEAykBbFACsTyaEEwjwLBQFoQC6RALI8WBPMoEAykBbFACsTyaEEwjwLBQFoQC6RALI8WBPMoEAykBbFACsTyaEEwjwLBQFoQC6RALI8WBPMoEAykBbFACsTyaEEwjwLBQFoQC6RALI8WBPMoEAykBbFACsTyaEEwjwLBQFoQC6RALI8WBPMoEAykBbFACsTyaEEwjwLBQFoQC6RALI8WBPMoEAykBbFACsTyaEEwjwLBQFoQC6RALI8WBPMoEAykBbFACsTyaEEwjwLBQFoQC6RALI8WBPMoEAykBbFACsTyaEEwjwLBQFoQC6RALI8WBPMoEAykBbFACsTyaEEwjx9P3jLuXdxW1gAAAABJRU5ErkJggg==");"
      />
    </div>
  `);
});
