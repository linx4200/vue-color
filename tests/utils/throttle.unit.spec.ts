import { describe, it, expect, vi } from 'vitest';
import { throttle } from '../../src/utils/throttle';

describe('throttle', () => {
  it('should call function immediately if leading is true', () => {
    const mockFn = vi.fn();
    const throttledFn = throttle(mockFn, 100, { leading: true, trailing: false });

    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should not call function again within delay if leading is true', () => {
    const mockFn = vi.fn();
    const throttledFn = throttle(mockFn, 100, { leading: true, trailing: false });

    throttledFn();
    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should call function at the end if trailing is true', () => {
    vi.useFakeTimers();
    const mockFn = vi.fn();
    const throttledFn = throttle(mockFn, 100, { leading: false, trailing: true });

    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('should call function only once if called multiple times rapidly', () => {
    vi.useFakeTimers();
    const mockFn = vi.fn();
    const throttledFn = throttle(mockFn, 100, { leading: true, trailing: true });

    throttledFn();
    throttledFn();
    throttledFn();

    expect(mockFn).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it('should reset the timeout correctly', () => {
    vi.useFakeTimers();
    const mockFn = vi.fn();
    const throttledFn = throttle(mockFn, 100, { leading: false, trailing: true });

    throttledFn();
    vi.advanceTimersByTime(50);
    expect(mockFn).toHaveBeenCalledTimes(0);

    throttledFn();
    vi.advanceTimersByTime(50);
    expect(mockFn).toHaveBeenCalledTimes(1);

    throttledFn();
    vi.advanceTimersByTime(50);
    expect(mockFn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(50);
    expect(mockFn).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });
});