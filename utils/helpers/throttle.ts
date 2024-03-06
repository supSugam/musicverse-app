export function throttle<Args extends unknown[]>(
  func: (...args: Args) => void,
  delay: number
): (...args: Args) => void {
  let lastCall = 0;
  let lastArgs: Args | null = null;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const throttled = (...args: Args) => {
    const now = Date.now();
    const remainingTime = delay - (now - lastCall);

    if (remainingTime <= 0) {
      func(...args);
      lastCall = now;
      lastArgs = null;

      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    } else {
      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          if (lastArgs) {
            func(...lastArgs);
            lastArgs = null;
            timeoutId = null;
          }
        }, remainingTime);
      }

      lastArgs = args;
    }
  };

  return throttled;
}
