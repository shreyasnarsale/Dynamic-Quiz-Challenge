import React, { useState, useEffect, useRef } from 'react';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  isPaused: boolean;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeUp, isPaused }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  // FIX: In a browser environment, setInterval returns a number, not a NodeJS.Timeout object.
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [duration, onTimeUp, isPaused]);

  const progress = (timeLeft / duration) * 100;
  const strokeDashoffset = 283 * (1 - progress / 100);

  let colorClass = 'text-green-400';
  if (timeLeft <= duration * 0.5) colorClass = 'text-yellow-400';
  if (timeLeft <= duration * 0.25) colorClass = 'text-red-500';

  return (
    <div className={`relative w-16 h-16 font-mono text-2xl font-bold ${colorClass}`}>
      <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-slate-600"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <circle
          className="transition-all duration-1000 linear"
          strokeWidth="8"
          strokeDasharray="283"
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
        />
      </svg>
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        {timeLeft}
      </div>
    </div>
  );
};

export default Timer;
