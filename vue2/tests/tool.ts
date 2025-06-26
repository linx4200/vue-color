import { EventType, fireEvent } from '@testing-library/vue';

/**
 * Simulate a mousedown event using the given `left` and `top` percentages.
 *
 * @param Object Be aware that the values of `left` and `top` are percentages.
 */
export const mockClickPosition = ({ container, left = 0, top = 0, event = 'mouseDown' }: { container: HTMLElement, left?: number, top?: number, event?: EventType }) => {

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

  const clientX = left * mockContainerWidth;
  const clientY = top * mockContainerHeight;

  fireEvent[event](container, {
    clientX,
    clientY
  });
}

export const wait = () => {
  return new Promise(resolve => setTimeout(resolve));
}