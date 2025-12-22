import { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import type { UseQuizTimerProps, UseQuizTimerReturn } from '@/features/types';
import { formatQuizTime } from '@/features/quiz/helpers';

const subscribe = (callback: () => void) => {
  document.addEventListener('visibilitychange', callback);
  return () => document.removeEventListener('visibilitychange', callback);
};
const getSnapshot = () => !document.hidden;

const useQuizTimer = ({ timeLimitInMinutes }: UseQuizTimerProps): UseQuizTimerReturn => {
  const [timeRemaining, setTimeRemaining] = useState(timeLimitInMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const workerRef = useRef<Worker | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const lastVisibleTimeRef = useRef<number | null>(null);

  // reset time when time limit changes
  useEffect(() => {
    setTimeRemaining(timeLimitInMinutes * 60);
  }, [timeLimitInMinutes]);

  // initialize web worker
  useEffect(() => {
    const workerUrl = `${window.location.origin}/timer-worker.js`;
    const timerWorker = new Worker(workerUrl);

    workerRef.current = timerWorker;

    timerWorker.onmessage = () => {
      setTimeRemaining((prev) => {
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
    };
  }, []);

  // check if page is visible
  const isVisible = useSyncExternalStore(subscribe, getSnapshot);

  // visibility change for background sync
  useEffect(() => {
    if (isVisible) {
      if (isRunning && lastVisibleTimeRef.current && startTimeRef.current) {
        const now = Date.now();
        const elapsedWhileHidden = Math.floor((now - lastVisibleTimeRef.current) / 1000);

        setTimeRemaining((prev) => {
          const newTime = Math.max(0, prev - elapsedWhileHidden);

          if (newTime === 0 && workerRef.current) {
            workerRef.current.postMessage({ action: 'stop' });
            setIsRunning(false);
            setIsTimeUp(true);
          }
          return newTime;
        });
      }
      lastVisibleTimeRef.current = Date.now();
    } else {
      lastVisibleTimeRef.current = Date.now();
    }
  }, [isVisible, isRunning]);

  const startTimer = () => {
    if (workerRef.current && !isRunning) {
      startTimeRef.current = Date.now();
      lastVisibleTimeRef.current = Date.now();
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
    startTimeRef.current = null;
    lastVisibleTimeRef.current = null;
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
