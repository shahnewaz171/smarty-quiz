import { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import type { UseQuizTimerProps, UseQuizTimerReturn } from '@/features/types';
import { formatQuizTime } from '@/features/quiz/helpers';

const subscribe = (callback: () => void) => {
  document.addEventListener('visibilitychange', callback);
  return () => document.removeEventListener('visibilitychange', callback);
};
const getSnapshot = () => !document.hidden;

interface UseServerTimerProps {
  expiresAt?: string;
  serverTime?: string | null;
}

const useQuizTimer = ({
  timeLimitInMinutes,
  expiresAt,
  serverTime
}: UseQuizTimerProps & UseServerTimerProps): UseQuizTimerReturn => {
  const [timeRemaining, setTimeRemaining] = useState(timeLimitInMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const workerRef = useRef<Worker | null>(null);
  const expiresAtRef = useRef<Date | null>(null);
  const serverTimeOffsetRef = useRef<number>(0);

  // calculate server time offset on mount or when serverTime changes
  useEffect(() => {
    if (serverTime) {
      const serverDate = new Date(serverTime);
      const localDate = new Date();
      serverTimeOffsetRef.current = serverDate.getTime() - localDate.getTime();
    }
  }, [serverTime]);

  // initialize expiration time
  useEffect(() => {
    if (expiresAt) {
      expiresAtRef.current = new Date(expiresAt);

      const now = Date.now() + serverTimeOffsetRef.current;
      const remaining = Math.max(0, Math.floor((expiresAtRef.current.getTime() - now) / 1000));
      setTimeRemaining(remaining);

      if (remaining === 0) {
        setIsTimeUp(true);
      }
    } else {
      setTimeRemaining(timeLimitInMinutes * 60);
    }
  }, [expiresAt, timeLimitInMinutes]);

  // initialize web worker
  useEffect(() => {
    const workerUrl = `${window.location.origin}/timer-worker.js`;
    const timerWorker = new Worker(workerUrl);

    workerRef.current = timerWorker;

    timerWorker.onmessage = () => {
      setTimeRemaining((prev) => {
        // recalculate based on server time to prevent drift
        if (expiresAtRef.current) {
          const now = Date.now() + serverTimeOffsetRef.current;
          const remaining = Math.max(0, Math.floor((expiresAtRef.current.getTime() - now) / 1000));

          if (remaining === 0) {
            timerWorker.postMessage({ action: 'stop' });
            setIsRunning(false);
            setIsTimeUp(true);
          }
          return remaining;
        }

        // fallback to countdown
        const newTime = Math.max(0, prev - 1);
        if (newTime === 0) {
          timerWorker.postMessage({ action: 'stop' });
          setIsRunning(false);
          setIsTimeUp(true);
        }
        return newTime;
      });
    };

    return () => {
      timerWorker.postMessage({ action: 'stop' });
      timerWorker.terminate();
      workerRef.current = null;
    };
  }, []);

  // check if page is visible
  const isVisible = useSyncExternalStore(subscribe, getSnapshot);

  // visibility change for background sync
  useEffect(() => {
    if (isVisible && isRunning && expiresAtRef.current) {
      // recalculate time remaining when page becomes visible
      const now = Date.now() + serverTimeOffsetRef.current;
      const remaining = Math.max(0, Math.floor((expiresAtRef.current.getTime() - now) / 1000));

      setTimeRemaining(remaining);

      if (remaining === 0 && workerRef.current) {
        workerRef.current.postMessage({ action: 'stop' });
        setIsRunning(false);
        setIsTimeUp(true);
      }
    }
  }, [isVisible, isRunning]);

  const startTimer = () => {
    if (workerRef.current && !isRunning && timeRemaining > 0) {
      workerRef.current.postMessage({ action: 'start', interval: 1000 });
      setIsRunning(true);
    }
  };

  const pauseTimer = () => {
    if (workerRef.current && isRunning) {
      workerRef.current.postMessage({ action: 'stop' });
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    if (workerRef.current) {
      workerRef.current.postMessage({ action: 'stop' });
    }
    setTimeRemaining(timeLimitInMinutes * 60);
    setIsRunning(false);
    setIsTimeUp(false);
    expiresAtRef.current = null;
  };

  return {
    timeRemaining,
    startTimer,
    pauseTimer,
    resetTimer,
    isRunning,
    isTimeUp,
    formattedTime: formatQuizTime(timeRemaining)
  };
};

export default useQuizTimer;
