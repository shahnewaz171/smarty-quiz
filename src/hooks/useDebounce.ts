import * as React from 'react';
import useMountEffect from '@/hooks/useMountEffect';
import useUnmountEffect from '@/hooks/useUnmountEffect';

export const useDebounceValue = <T>(initialValue: T, delay: number) => {
  const [value, setValue] = React.useState(initialValue);
  const [debouncedValue, setDebouncedValue] = React.useState(initialValue);
  const mountedRef = React.useRef(false);
  const timeoutRef = React.useRef<number | null>(null);

  const cancelTimer = () => window.clearTimeout(timeoutRef.current || undefined);

  useMountEffect(() => {
    mountedRef.current = true;
  });

  useUnmountEffect(() => {
    cancelTimer();
  });

  React.useEffect(() => {
    if (!mountedRef.current) {
      return;
    }

    cancelTimer();
    timeoutRef.current = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
  }, [value, delay]);

  return [value, debouncedValue, setValue] as const;
};

export const useDebounceCallback = <T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
) => {
  const timeoutRef = React.useRef<number | null>(null);

  const cancel = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useUnmountEffect(cancel);

  const debouncedCallback = (...args: Parameters<T>) => {
    cancel();
    timeoutRef.current = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };

  return debouncedCallback;
};
