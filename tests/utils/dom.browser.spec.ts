import { describe, it, expect, vi } from 'vitest';
import { getPageXYFromEvent, getScrollXY, getAbsolutePosition } from '../../src/utils/dom'; // 替换为实际路径

describe('getPageXYFromEvent', () => {
  it('should return correct coordinates for MouseEvent', () => {
    const event = new MouseEvent('click', { clientX: 100, clientY: 200 });
    expect(getPageXYFromEvent(event)).toEqual({ x: 100, y: 200 });
  });

  it('should return correct coordinates for TouchEvent', () => {
    const touch = new Touch({ identifier: 1, target: new EventTarget(), pageX: 150, pageY: 250 });
    const touchEvent = new TouchEvent('touchstart', {
      touches: [touch]
    });
    expect(getPageXYFromEvent(touchEvent)).toEqual({ x: 150, y: 250 });
  });
});

describe('getScrollXY', () => {
  it('should return correct scroll values', () => {
    vi.stubGlobal('scrollX', 50);
    vi.stubGlobal('scrollY', 100);
    expect(getScrollXY()).toEqual({ x: 50, y: 100 });
  });
});

describe('getAbsolutePosition', () => {
  it('should return correct absolute position of an element', () => {
    const mockElement = {
      getBoundingClientRect: () => ({ left: 30, top: 40 }),
    } as HTMLElement;

    vi.stubGlobal('scrollX', 50);
    vi.stubGlobal('scrollY', 100);

    expect(getAbsolutePosition(mockElement)).toEqual({ x: 80, y: 140 });
  });
});
