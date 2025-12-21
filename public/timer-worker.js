let timerId;
let interval = 1000;
let expected;

function step() {
  const drift = Date.now() - expected;
  postMessage('tick');
  expected += interval;
  timerId = setTimeout(step, Math.max(0, interval - drift));
}

function handleTimerMessage(e) {
  const { action, interval: newInterval } = e.data;

  if (action === 'start') {
    if (newInterval) interval = newInterval;
    if (!timerId) {
      expected = Date.now() + interval;
      timerId = setTimeout(step, interval);
    }
  } else if (action === 'stop') {
    clearTimeout(timerId);
    timerId = null;
  }
}

onmessage = handleTimerMessage;
