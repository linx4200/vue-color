import { describe, it, expect, vi } from 'vitest';
import { throttle } from '../../src/utils/throttle';

describe('throttle', () => {
  it('should call function immediately', () => {
    const mockFn = vi.fn();
    const throttledFn = throttle(mockFn, 100);

    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should call function only once if called multiple times rapidly', () => {
    vi.useFakeTimers();
    const mockFn = vi.fn();
    const throttledFn = throttle(mockFn, 100);

    throttledFn();
    throttledFn();
    throttledFn();

    expect(mockFn).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });
});