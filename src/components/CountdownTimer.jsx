import React, { useState, useEffect } from "react";

const CountdownTimer = ({ errandId, durationMs = 3 * 60 * 60 * 1000, onComplete }) => {
  const storageKey = `timerStart-${errandId}`;
  const [remaining, setRemaining] = useState(durationMs);

  useEffect(() => {
    // Retrieve or set the start time
    let start = localStorage.getItem(storageKey);
    if (!start) {
      start = Date.now();
      localStorage.setItem(storageKey, start.toString());
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - parseInt(start, 10);
      const timeLeft = Math.max(durationMs - elapsed, 0);
      setRemaining(timeLeft);

      if (timeLeft === 0) {
        clearInterval(interval);
        if (onComplete) onComplete(); // Trigger your final callback
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [durationMs, storageKey, onComplete]);

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  return (
    <div className="text-sm text-white bg-gray-700 px-3 py-1 rounded shadow w-fit">
      <span> Awaiting confirmation:</span> Time left: {hours}h {minutes}m {seconds}s
    </div>
  );
};

export default CountdownTimer;
