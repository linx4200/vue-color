import { fireEvent } from '@testing-library/vue';

/**
 * Simulate a mousedown event using the given `left` and `top` percentages.
 *
 * @param Object Be aware that the values of `left` and `top` are percentages.
 */
export const mockClickPosition = ({ container, left, top }: { container: HTMLElement, left?: number, top?: number }) => {

  const mockContainerWidth = 100;
  const mockContainerHeight = 100;

  Object.defineProperty(container, 'clientWidth', {
    writable: true,
    configurable: true,
    value: mockContainerWidth,
  });

  Object.defineProperty(container, 'clientHeight', {
    writable: true,
    configurable: true,
    value: mockContainerHeight,
  });

  const clientX = (left ?? 0) * mockContainerWidth;
  const clientY = (top ?? 0) * mockContainerHeight;

  fireEvent.mouseDown(container, {
    clientX,
    clientY
  });
}