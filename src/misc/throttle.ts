function throttle<T extends (...args: any[]) => void>(
  delay: number,
  callback: T
): T {
  let lastCall = 0;
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    const now = Date.now();

    if (timeout) {
      clearTimeout(timeout);
    }

    if (now - lastCall >= delay) {
      lastCall = now;
      callback(...args);
    } else {
      timeout = setTimeout(() => {
        lastCall = Date.now();
        callback(...args);
      }, delay - (now - lastCall));
    }
  } as T;
}
