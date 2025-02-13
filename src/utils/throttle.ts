export function throttle<T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
  options: { leading?: boolean; trailing?: boolean } = { leading: true, trailing: false }
): (...args: Parameters<T>) => void {
  let lastCallTime: number | null = null;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;

  return function (...args: Parameters<T>) {
    const now = Date.now();
    const shouldCall = lastCallTime === null && options.leading;

    if (shouldCall) {
      callback(...args);
      lastCallTime = now;
    } else {
      lastArgs = args;
      if (!timeout && options.trailing) {
        timeout = setTimeout(() => {
          if (lastArgs) {
            callback(...lastArgs);
            lastCallTime = Date.now();
          }
          timeout = null;
          lastArgs = null;
        }, delay);
      }
    }
  };
}